import "dotenv/config";
import { chromium } from "@playwright/test";
import { Pool } from "pg";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const origin = process.env.BACKEND_URL || "http://127.0.0.1:8081";
assert.equal(new URL(origin).hostname, "127.0.0.1");
const db = new Pool({
  connectionString: "postgresql://pool_local@127.0.0.1:5433/PoolControl",
});
const marker = `QA integração ${Date.now()}`;
let token = "",
  customer,
  product,
  browser;
async function api(path, body, method = body ? "POST" : "GET") {
  const response = await fetch(origin + "/api/v1" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  assert.ok(
    response.ok,
    `${method} ${path}: ${response.status} ${JSON.stringify(data)}`,
  );
  return data;
}
try {
  assert.equal((await fetch(origin + "/api/v1/customers")).status, 401);
  const auth = await api("/auth/login", {
    email: "admin@poolcontrol.local",
    password: "Admin@123",
  });
  token = auth.accessToken;
  customer = await api("/customers", {
    name: marker,
    email: "qa@example.test",
  });
  product = await api("/products", {
    name: marker,
    sku: `QA-${Date.now()}`,
    costPrice: 40,
    salePrice: 100.45,
    minimumStock: 1,
    unit: "UN",
  });
  await api("/inventory/movements", {
    productId: product.id,
    type: "ENTRY",
    quantity: 10,
    unitCost: 40,
    notes: marker,
  });
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await mkdir("artifacts", { recursive: true });
  await page.goto("http://127.0.0.1:3000/inicio");
  await page.waitForURL(/login/);
  await page.locator('input[name="login"]').fill("admin@poolcontrol.local");
  await page.locator('input[name="password"]').fill("Admin@123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL(/inicio$/);
  console.log("PASS: login JWT e sessão protegida.");
  await page
    .getByRole("link", { name: "Nova venda", exact: true })
    .first()
    .click();
  await page
    .getByRole("heading", { name: "Novo orçamento", exact: true })
    .waitFor();
  await page.getByLabel("Cliente *", { exact: true }).selectOption(customer.id);
  await page.getByLabel("Nome do projeto *").fill(marker);
  await page
    .getByLabel("Adicionar um produto do catálogo")
    .selectOption(product.id);
  await page.getByLabel("Quantidade *").fill("2");
  await page.getByLabel("Desconto (R$)", { exact: true }).fill("10");
  await page.getByLabel("Observações e condições").fill("Prazo: 10 dias.");
  await page.screenshot({
    path: "artifacts/novo-orcamento-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Salvar orçamento", exact: true })
    .click();
  await page.waitForURL(/orcamentos\?salvo=/);
  await page
    .getByRole("searchbox", { name: "Buscar", exact: true })
    .fill(marker);
  await page.getByRole("link", { name: "Editar", exact: true }).click();
  await page.getByLabel("Nome do projeto *").fill(marker + " editado");
  await page
    .getByRole("button", { name: "Salvar orçamento", exact: true })
    .click();
  await page.waitForURL(/orcamentos\?salvo=/);
  await page
    .getByRole("searchbox", { name: "Buscar", exact: true })
    .fill(marker);
  await page.getByRole("button", { name: "Ver itens", exact: true }).click();
  await page.screenshot({
    path: "artifacts/orcamentos-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Gerar venda", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirmar e gerar venda", exact: true })
    .click();
  await page.waitForURL(/pedidos\/[0-9a-f-]{36}$/);
  const saleId = page.url().split("/").at(-1);
  const detail = await api("/sales/" + saleId);
  assert.equal(Number(detail.sale.totalSale), 190.9);
  assert.equal(Number(detail.sale.productCost), 80);
  assert.equal(detail.sale.project, marker + " editado");
  const stock = await api("/inventory/" + product.id);
  assert.equal(Number(stock.physical), 8);
  const titles = (await api("/financial/receivables")).filter(
    (r) => r.sourceId === saleId,
  );
  assert.equal(titles.length, 1);
  assert.equal(Number(titles[0].amount), 190.9);
  await api(`/financial/receivables/${titles[0].id}/pay`, {});
  const quoteId = detail.sale.quoteId;
  const duplicate = await fetch(origin + `/api/v1/quotes/${quoteId}/convert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      paymentMethod: "PIX",
      dueDate: "2026-12-31",
      paid: false,
    }),
  });
  assert.equal(duplicate.status, 422);
  console.log(
    "PASS: criar e editar orçamento, converter, baixar estoque e gerar/receber título.",
  );
  await page.goto("http://127.0.0.1:3000/vendas/pedidos");
  await page
    .getByRole("searchbox", { name: "Buscar", exact: true })
    .fill(marker);
  await page.getByRole("heading", { name: marker, exact: true }).waitFor();
  await page.screenshot({
    path: "artifacts/vendas-desktop.png",
    fullPage: true,
  });
  for (const path of [
    "/vendas",
    "/clientes",
    "/financeiro",
    "/estoque",
    "/vendedores",
    "/ordens-servico",
    "/piscinas",
    "/relatorios",
    "/configuracoes",
    "/vendas/custos",
    "/vendas/comissoes",
    "/vendas/relatorios",
  ]) {
    const response = await page.goto("http://127.0.0.1:3000" + path);
    assert.equal(response.status(), 200, path);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3000/vendas/orcamentos/novo");
  await page
    .getByRole("heading", { name: "Novo orçamento", exact: true })
    .waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "artifacts/novo-orcamento-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Cadastrar novo cliente", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.deepEqual(errors, []);
  console.log("PASS: módulos conectados à API, modal e layout mobile.");
} finally {
  await browser?.close();
  if (customer) {
    await db.query(
      "update quotes set converted_sale_id=null where customer_id=$1",
      [customer.id],
    );
    for (const table of [
      "sale_items",
      "sale_costs",
      "sale_payments",
      "commissions",
    ])
      await db.query(
        `delete from ${table} where sale_id in (select id from sales where customer_id=$1)`,
        [customer.id],
      );
    await db.query("delete from accounts_receivable where customer_id=$1", [
      customer.id,
    ]);
    await db.query(
      "delete from audit_logs where entity_id in (select id from sales where customer_id=$1)",
      [customer.id],
    );
    await db.query("delete from sales where customer_id=$1", [customer.id]);
    await db.query(
      "delete from quote_items where quote_id in (select id from quotes where customer_id=$1)",
      [customer.id],
    );
    await db.query("delete from quotes where customer_id=$1", [customer.id]);
    await db.query("delete from customers where id=$1", [customer.id]);
  }
  if (product) {
    await db.query("delete from stock_movements where product_id=$1", [
      product.id,
    ]);
    await db.query("delete from products where id=$1", [product.id]);
  }
  await db.end();
}
