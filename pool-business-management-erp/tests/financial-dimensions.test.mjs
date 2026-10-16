import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import pg from "pg";

const databaseUrl = process.env.DIMENSION_TEST_DATABASE_URL;
const origin = process.env.DIMENSION_TEST_API_URL;
const secret = process.env.DIMENSION_TEST_JWT_SECRET;

test(
  "dimensões financeiras: persistência, isolamento e regras",
  {
    skip: !databaseUrl || !origin || !secret,
  },
  async (t) => {
    assert.match(new URL(databaseUrl).pathname, /_test$/);
    const db = new pg.Client({ connectionString: databaseUrl });
    await db.connect();
    const companyIds = [];
    async function tenant(name) {
      const company = (
        await db.query(
          `INSERT INTO empresas (legal_name, trade_name, status, created_at, updated_at) VALUES ($1, $1, 'ACTIVE', now(), now()) RETURNING id`,
          [name],
        )
      ).rows[0].id;
      companyIds.push(company);
      const user = (
        await db.query(
          `INSERT INTO users (empresa_id, name, email, password_hash, active, created_at, updated_at) VALUES ($1, $2, $3, 'unused', true, now(), now()) RETURNING id`,
          [company, name, `${randomUUID()}@test.invalid`],
        )
      ).rows[0].id;
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      ).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          sub: String(user),
          companyId: String(company),
          iss: "poolcontrol-api",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          permissions: ["FINANCIAL_VIEW", "FINANCIAL_CREATE"],
        }),
      ).toString("base64url");
      const signature = createHmac("sha256", secret)
        .update(`${header}.${payload}`)
        .digest("base64url");
      return { company, user, token: `${header}.${payload}.${signature}` };
    }
    try {
      const a = await tenant("Teste dimensões A"),
        b = await tenant("Teste dimensões B");
      async function request(
        path,
        { method = "GET", body, actor = a, expected = 200 } = {},
      ) {
        const response = await fetch(`${origin}/api/v1${path}`, {
          method,
          headers: {
            Authorization: `Bearer ${actor.token}`,
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        });
        const text = await response.text();
        assert.equal(response.status, expected, `${method} ${path}: ${text}`);
        return text ? JSON.parse(text) : null;
      }
      const base = "/financeiro/cadastros";
      const centerBody = {
        code: "ADM",
        name: "Administrativo",
        type: "ADMINISTRATIVO",
        active: true,
        acceptsEntries: true,
      };
      let center, parent, unit, project, nature, transfer, account, payable;
      await t.test("centro, hierarquia e código por empresa", async () => {
        center = (
          await request(`${base}/centros-custo`, {
            method: "POST",
            body: centerBody,
            expected: 201,
          })
        ).id;
        parent = (
          await request(`${base}/centros-custo`, {
            method: "POST",
            body: {
              ...centerBody,
              code: "GRUPO",
              name: "Grupo",
              acceptsEntries: false,
            },
            expected: 201,
          })
        ).id;
        await request(`${base}/centros-custo/${center}`, {
          method: "PUT",
          body: { ...centerBody, parentId: parent },
        });
        await request(`${base}/centros-custo/${parent}`, {
          method: "PUT",
          body: { ...centerBody, code: "GRUPO", parentId: center },
          expected: 422,
        });
        await request(`${base}/centros-custo`, {
          method: "POST",
          body: centerBody,
          expected: 422,
        });
        await request(`${base}/centros-custo`, {
          method: "POST",
          body: centerBody,
          actor: b,
          expected: 201,
        });
        await request(`${base}/centros-custo/${center}`, {
          method: "PUT",
          body: centerBody,
          actor: b,
          expected: 404,
        });
        const foreign = (
          await request(`${base}/centros-custo`, { actor: b })
        )[0].id;
        await request(`${base}/centros-custo/${center}`, {
          method: "PUT",
          body: { ...centerBody, parentId: foreign },
          expected: 422,
        });
      });
      await t.test("unidade e projeto independentes", async () => {
        unit = (
          await request(`${base}/unidades`, {
            method: "POST",
            body: {
              code: "CBA",
              name: "Matriz Cuiabá",
              type: "MATRIZ",
              active: true,
              defaultCostCenterId: center,
            },
            expected: 201,
          })
        ).id;
        project = (
          await request(`${base}/projetos`, {
            method: "POST",
            body: {
              code: "PRJ1",
              name: "Condomínio",
              type: "OBRA",
              status: "EM_ANDAMENTO",
              unitId: unit,
              costCenterId: center,
              active: true,
              contractAmount: 80000,
              costBudget: 45000,
              expectedRevenue: 80000,
            },
            expected: 201,
          })
        ).id;
        const rows = await request(`${base}/projetos`);
        assert.equal(String(rows[0].unitId), unit);
        await request(`${base}/unidades`, {
          method: "POST",
          body: {
            code: "BAD",
            name: "Data inválida",
            type: "LOJA",
            active: true,
            startDate: "2026-10-10",
            endDate: "2026-10-01",
          },
          expected: 422,
        });
      });
      await t.test(
        "natureza e proteção contra transferência como despesa",
        async () => {
          const body = {
            code: "DESP",
            name: "Despesa operacional",
            type: "DESPESA",
            group: "OPERACIONAL",
            movement: "SAIDA",
            active: true,
            acceptsEntries: true,
            affectsCashFlow: true,
            affectsDre: true,
            affectsResult: true,
          };
          nature = (
            await request(`${base}/naturezas-financeiras`, {
              method: "POST",
              body,
              expected: 201,
            })
          ).id;
          await request(`${base}/naturezas-financeiras`, {
            method: "POST",
            body: {
              ...body,
              code: "TR",
              type: "TRANSFERENCIA",
              movement: "AMBOS",
            },
            expected: 422,
          });
          transfer = (
            await request(`${base}/naturezas-financeiras`, {
              method: "POST",
              body: {
                ...body,
                code: "TR",
                type: "TRANSFERENCIA",
                movement: "AMBOS",
                affectsDre: false,
                affectsResult: false,
              },
              expected: 201,
            })
          ).id;
          account = randomUUID();
          await db.query(
            `INSERT INTO plano_contas (id,empresa_id,codigo,nome,natureza,sintetica,ativo,aceita_lancamento,criado_em,atualizado_em) VALUES ($1,$2,'9.1','Materiais','DEVEDORA',false,true,true,now(),now())`,
            [account, a.company],
          );
          await request(`${base}/plano-contas/${account}/natureza-padrao`, {
            method: "PUT",
            body: { natureId: nature },
            expected: 204,
          });
        },
      );
      await t.test(
        "classificação, sugestão de natureza, rateio e atomicidade",
        async () => {
          const body = {
            description: "Teste materiais",
            amount: 100,
            dueDate: "2026-11-20",
            competenceDate: "2026-10-01",
            chartAccountId: account,
            costCenterId: center,
            unitId: unit,
            projectId: project,
            allocations: [{ costCenterId: center, percentage: 100 }],
          };
          const result = await request("/financial/payables", {
            method: "POST",
            body,
            expected: 201,
          });
          payable = result.id;
          assert.equal(result.financialNatureId, nature);
          assert.equal(String(result.unitId), unit);
          assert.equal(String(result.projectId), project);
          const before = (await request("/financial/payables")).length;
          await request("/financial/payables", {
            method: "POST",
            body: {
              ...body,
              allocations: [{ costCenterId: center, percentage: 90 }],
            },
            expected: 422,
          });
          await request("/financial/payables", {
            method: "POST",
            body: { ...body, costCenterId: parent },
            expected: 422,
          });
          await request("/financial/payables", {
            method: "POST",
            body: { ...body, financialNatureId: transfer },
            expected: 422,
          });
          assert.equal((await request("/financial/payables")).length, before);
          const rates = (
            await db.query(
              "SELECT sum(valor) AS amount, sum(percentual) AS percentage FROM payable_rateios WHERE lancamento_id=$1",
              [payable],
            )
          ).rows[0];
          assert.equal(Number(rates.amount), 100);
          assert.equal(Number(rates.percentage), 100);
        },
      );
      await t.test(
        "orçamentos, lançamentos, indicadores e histórico",
        async () => {
          await request(`${base}/centros-custo/${center}/orcamento`, {
            method: "PUT",
            body: { period: "2026-10-01", planned: 500, revised: 450 },
            expected: 204,
          });
          await request(`${base}/projetos/${project}/orcamento`, {
            method: "PUT",
            body: {
              chartAccountId: account,
              costCenterId: center,
              planned: 500,
            },
            expected: 204,
          });
          let budget = (
            await request(`${base}/centros-custo/${center}/orcamento`)
          )[0];
          assert.equal(Number(budget.committed), 100);
          assert.equal(Number(budget.realized), 0);
          await request(`/financial/payables/${payable}/pay`, {
            method: "POST",
          });
          budget = (await request(`${base}/projetos/${project}/orcamento`))[0];
          assert.equal(Number(budget.realized), 100);
          assert.equal(Number(budget.committed), 0);
          assert.equal(
            (await request(`${base}/centros-custo/${center}/lancamentos`))
              .length,
            1,
          );
          assert.ok(
            (await request(`${base}/centros-custo/${center}/historico`))
              .length >= 2,
          );
          assert.equal(
            (
              await request(`${base}/centros-custo/${center}/historico`, {
                actor: b,
              })
            ).length,
            0,
          );
          const revenue = (
            await db.query(
              `INSERT INTO accounts_receivable (empresa_id,source_type,description,amount,due_date,status,created_at,updated_at) VALUES ($1,'TEST','Receita teste',150,'2026-10-20','PAID',now(),now()) RETURNING id`,
              [a.company],
            )
          ).rows[0].id;
          await request(`${base}/projetos/${project}/receitas`, {
            method: "PUT",
            body: { receivableId: revenue },
            expected: 204,
          });
          const result = await request(`${base}/projetos/${project}/resultado`);
          assert.equal(Number(result.cost), 100);
          assert.equal(Number(result.revenue), 150);
          const options = await request("/financeiro/dimensoes");
          assert.equal(options.centers.length, 2);
          assert.equal(options.natures.length, 2);
        },
      );
    } finally {
      for (const table of [
        "payable_rateios",
        "accounts_payable",
        "accounts_receivable",
        "projeto_orcamento",
        "centro_custo_orcamento",
        "financial_dimension_history",
        "plano_contas",
        "projetos_financeiros",
        "filiais",
        "naturezas_financeiras",
        "centros_custos",
        "users",
        "empresas",
      ]) {
        const column = table === "empresas" ? "id" : "empresa_id";
        await db.query(
          `DELETE FROM ${table} WHERE ${column} = ANY($1::bigint[])`,
          [companyIds],
        );
      }
      await db.end();
    }
  },
);
