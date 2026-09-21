// Isolated UI fixture: never connects to the user's API or database.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
const titles = [{ id: 1, description: "Título do teste isolado", amount: "1234.56", dueDate: "2026-01-10", status: "PENDING", supplierId: 1, createdAt: "2026-01-01T12:00:00Z" }];
const permissions = ["FINANCIAL_VIEW", "FINANCIAL_CREATE", "CUSTOMER_VIEW", "SUPPLIER_VIEW"];
let mutations = 0;
const api = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json");
  const path = request.url;
  let result = [];
  if (path === "/api/v1/auth/me") result = { userId: "1", companyId: "1", email: "qa@example.invalid", roles: ["ADMIN"], permissions };
  else if (path === "/api/v1/company/me") result = { id: 1, legalName: "Empresa de teste isolado", tradeName: "PoolControl QA" };
  else if (path === "/api/v1/suppliers") result = [{ id: 1, name: "Fornecedor de teste" }];
  else if (path === "/api/v1/financial/summary") result = { receivablePending: "0", receivablePaid: "0", payablePending: "1234.56", payablePaid: "0", cashResult: "0" };
  else if (path === "/api/v1/financial/payables" && request.method === "GET") result = titles;
  else if (path === "/api/v1/financial/payables" && request.method === "POST") {
    let body = ""; for await (const chunk of request) body += chunk;
    const input = JSON.parse(body);
    assert.equal(input.amount, "25.50");
    result = { ...input, id: 2, status: "PENDING" }; titles.push(result); mutations++;
  } else if (path === "/api/v1/financial/payables/1/pay" && request.method === "POST") {
    titles[0].status = "PAID"; titles[0].paidAt = new Date().toISOString(); result = titles[0]; mutations++;
  } else if (request.method !== "GET") { response.statusCode = 404; result = { message: "Fixture route not implemented" }; }
  response.end(JSON.stringify(result));
});
api.listen(0, "127.0.0.1"); await once(api, "listening");
const probe = createServer(); probe.listen(0, "127.0.0.1"); await once(probe, "listening");
const port = probe.address().port; await new Promise(resolve => probe.close(resolve));
const origin = `http://127.0.0.1:${port}`;
let logs = "";
const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { env: { ...process.env, BACKEND_URL: `http://127.0.0.1:${api.address().port}`, NODE_ENV: "production" }, stdio: ["ignore", "pipe", "pipe"] });
app.stdout.on("data", chunk => { logs += chunk; }); app.stderr.on("data", chunk => { logs += chunk; });
let browser;
try {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(origin + "/login")).ok) break; } catch {}
    if (i === 59) throw new Error("Test server did not start");
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (fs.existsSync(chromium.executablePath()) ? undefined : "/snap/bin/chromium");
  browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = []; page.on("pageerror", error => errors.push(error.message));
  const claims = Buffer.from(JSON.stringify({ sub: "1", companyId: "1", name: "Operador QA" })).toString("base64url");
  await page.context().addCookies([{ name: "pool_access_token", value: `e30.${claims}.fixture-only`, url: origin }]);
  await page.goto(origin + "/financeiro");
  await page.getByRole("heading", { name: "Visão geral financeira" }).waitFor();
  assert.equal(await page.getByText("R$ 125.430,20").count(), 0);
  await page.goto(origin + "/financeiro/contas-pagar");
  await page.getByRole("button", { name: "Pagar", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(mutations, 0);
  await page.getByRole("button", { name: "Confirmar quitação" }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(mutations, 1);
  await page.getByRole("button", { name: "+ Nova conta a pagar" }).click();
  await page.getByLabel("Descrição", { exact: true }).fill("Nova obrigação de teste");
  await page.getByLabel("Valor original (R$)").fill("25,50");
  await page.getByRole("button", { name: "Salvar título" }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Nova obrigação de teste" }).waitFor();
  assert.equal(mutations, 2);
  await page.getByRole("button", { name: "Alternar tema claro ou escuro" }).click();
  assert.equal(await page.locator(".financial-workspace").getAttribute("data-theme"), "dark");
  await page.reload();
  await page.waitForFunction(() => document.querySelector(".financial-workspace")?.getAttribute("data-theme") === "dark");
  for (const route of ["contas-receber", "pagamentos", "recebimentos", "movimentacoes", "fluxo-caixa", "inadimplencia", "relatorios", "conciliacao", "dre"]) {
    const response = await page.goto(`${origin}/financeiro/${route}`); assert.equal(response.status(), 200, route);
    await page.locator(".financial-workspace h1").waitFor();
  }
  await page.goto(origin + "/financeiro/contas-pagar?q=nao-existe");
  await page.getByRole("heading", { name: "Nenhum título encontrado" }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + "/financeiro/contas-pagar");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  fs.mkdirSync("artifacts", { recursive: true });
  await page.screenshot({ path: "artifacts/financeiro-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/financeiro");
  await page.screenshot({ path: "artifacts/financeiro-desktop.png", fullPage: true });
  permissions.splice(permissions.indexOf("FINANCIAL_CREATE"), 1);
  await page.goto(origin + "/financeiro/contas-pagar");
  assert.equal(await page.getByRole("button", { name: "+ Nova conta a pagar" }).count(), 0);
  assert.equal(await page.getByRole("button", { name: "Pagar", exact: true }).count(), 0);
  assert.deepEqual(errors, []);
  console.log("PASS: dashboard real, confirmação, cadastro, permissões, filtros, rotas, tema persistente e mobile; API isolada, sem alterações no banco.");
} catch (error) {
  console.error(logs.slice(-7000)); throw error;
} finally {
  await browser?.close(); app.kill("SIGTERM"); api.closeAllConnections(); api.close();
}
