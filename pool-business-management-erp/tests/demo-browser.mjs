import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
const origin = process.env.DEMO_TEST_ORIGIN || "http://127.0.0.1:3001";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROMIUM_PATH ||
    (existsSync(chromium.executablePath()) ? undefined : "/snap/bin/chromium"),
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.setDefaultTimeout(45000);
const writes = [],
  errors = [];
page.on("request", (r) => {
  if (!["GET", "HEAD"].includes(r.method())) writes.push(r.url());
});
page.on("pageerror", (e) => errors.push(e.message));
async function save() {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Salvar na demonstração" })
    .click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
}
try {
  await page.goto(origin + "/login", { timeout: 90000 });
  await page.locator("[name=login]").fill("demo@poolcontrol.local");
  await page.locator("[name=password]").fill("Demo@2026");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/demonstracao", { timeout: 90000 });
  await page.getByRole("heading", { name: "Olá, visitante" }).waitFor();
  await page.getByRole("button", { name: "Clientes", exact: true }).click();
  await page.getByRole("button", { name: "Novo cliente" }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Cliente apresentação");
  await save();
  await page
    .getByRole("cell", { name: "Cliente apresentação", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Estoque", exact: true }).click();
  await page.getByRole("button", { name: "Novo produto" }).click();
  await page
    .getByLabel("Produto", { exact: true })
    .fill("Produto apresentação");
  await page.getByLabel("Código / SKU").fill("APRES-001");
  await page.getByLabel("Estoque inicial").fill("3");
  await page.getByLabel("Preço de venda (R$)").fill("10.50");
  await save();
  await page.getByRole("button", { name: "Vendas", exact: true }).click();
  await page
    .getByRole("button", { name: "Simular venda", exact: true })
    .click();
  await page
    .getByLabel("Cliente", { exact: true })
    .selectOption({ label: "Cliente apresentação" });
  await page
    .getByLabel("Produto", { exact: true })
    .selectOption({ label: "Produto apresentação · 3 disponíveis" });
  await page.getByLabel("Quantidade", { exact: true }).fill("2");
  await save();
  await page
    .getByRole("cell", { name: "Produto apresentação", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Financeiro", exact: true }).click();
  await page.getByRole("button", { name: "Nova conta" }).click();
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Conta apresentação");
  await page.getByLabel("Valor (R$)").fill("25");
  await page.getByLabel("Vencimento").fill("2026-10-20");
  await save();
  await page.getByRole("button", { name: "Simular pagamento" }).click();
  await page.getByRole("cell", { name: "Pago", exact: true }).waitFor();
  const stored = await page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem(
          "poolcontrol.demo.data." +
            sessionStorage.getItem("poolcontrol.demo.tab"),
        ),
      ).state,
  );
  assert.equal(stored.products.find((p) => p.sku === "APRES-001").quantity, 1);
  assert.equal(stored.sales[0].total, 21);
  assert.equal(stored.payables[0].paid, true);
  assert.deepEqual(
    writes.filter((url) => new URL(url).pathname !== "/login"),
    [],
    "Demo must not send business mutation requests",
  );
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.waitForURL("**/login");
  assert.equal(
    await page.evaluate(
      () =>
        Object.keys(localStorage).filter((k) =>
          k.startsWith("poolcontrol.demo.data."),
        ).length,
    ),
    0,
  );
  await page.getByRole("button", { name: "Experimentar demonstração" }).click();
  await page.waitForURL("**/demonstracao");
  await page.getByRole("heading", { name: "Olá, visitante" }).waitFor();
  const fresh = await page.evaluate(
    () =>
      JSON.parse(
        localStorage.getItem(
          "poolcontrol.demo.data." +
            sessionStorage.getItem("poolcontrol.demo.tab"),
        ),
      ).state,
  );
  assert.equal(fresh.clients.length, 1);
  assert.equal(fresh.products.length, 2);
  assert.equal(fresh.sales.length, 0);
  await page.goto(origin + "/login");
  assert.equal(
    await page.evaluate(() => sessionStorage.getItem("poolcontrol.demo.tab")),
    null,
  );
  assert.equal(
    await page.evaluate(
      () =>
        Object.keys(localStorage).filter((k) =>
          k.startsWith("poolcontrol.demo.data."),
        ).length,
    ),
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "Navegador validado: login demo, cadastros, venda/estoque, pagamento, reset ao sair e zero gravações no backend.",
  );
} finally {
  await browser.close();
}
