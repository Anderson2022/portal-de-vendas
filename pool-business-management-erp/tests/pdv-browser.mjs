import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const origin = process.env.PDV_TEST_ORIGIN || "http://127.0.0.1:3001";
const login = await fetch(
  (process.env.PDV_TEST_BACKEND || "http://127.0.0.1:8081") +
    "/api/v1/auth/login",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.PDV_TEST_EMAIL || "admin@poolcontrol.local",
      password: process.env.PDV_TEST_PASSWORD || "Admin@123",
    }),
  },
);
assert.equal(
  login.status,
  200,
  "Não foi possível autenticar o usuário de teste",
);
const { accessToken } = await login.json();
const browser = await chromium.launch({
  headless: true,
  executablePath: "/snap/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(45000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.context().addCookies([
  {
    name: "pool_access_token",
    value: accessToken,
    url: origin,
    httpOnly: true,
  },
]);
try {
  await page.goto(origin + "/vendas", { timeout: 90000 });
  const frame = page.locator(".poolcontrol-pdv");
  await frame.getByRole("heading", { name: "Olá, Administrador!" }).waitFor();
  assert.equal(await frame.locator(".module-card").count(), 5);
  assert.equal(
    await frame.locator(".sidebar, .topbar, .user-switch").count(),
    0,
  );

  await frame
    .locator(".module-card")
    .filter({ has: page.getByRole("heading", { name: "PDV", exact: true }) })
    .click();
  await frame.locator(".sale-item").first().waitFor();
  assert.equal(
    await frame.getByRole("toolbar", { name: "Operação do PDV" }).count(),
    1,
  );
  assert.equal(
    await frame.locator(".sidebar, .topbar, .user-switch").count(),
    0,
  );

  const before = await frame.locator(".sale-item").count();
  await frame
    .locator(".sale-item")
    .first()
    .getByRole("button", { name: "Remover item" })
    .click();
  assert.equal(await frame.locator(".sale-item").count(), before - 1);
  await frame
    .getByRole("button", { name: "Finalizar venda (F3)", exact: true })
    .click();
  await frame.getByRole("heading", { name: "Pagamento da venda" }).waitFor();
  await frame.getByRole("button", { name: "Confirmar pagamento (F9)" }).click();
  await frame.getByText("Nenhum produto na venda", { exact: true }).waitFor();
  await frame.locator(".mode-tab").filter({ hasText: "Delivery" }).click();
  await frame.locator(".delivery-layout").waitFor();
  await frame.locator(".mode-tab").filter({ hasText: "Serviços" }).click();
  await frame.locator(".service-layout").waitFor();
  await frame.locator(".mode-tab").filter({ hasText: "Mesas" }).click();
  await frame.locator(".tables-work").waitFor();
  await frame.locator(".mode-tab").filter({ hasText: "Supermercado" }).click();
  await frame.locator(".market-scan").waitFor();
  await page.screenshot({
    path: "/tmp/poolcontrol-pdv-integrado.png",
    fullPage: true,
  });
  assert.equal(await page.locator('iframe[title="Ponto de venda"]').count(), 0);
  assert.deepEqual(errors, []);
  console.log(
    "PDV validado em /vendas: exibição direta, carrinho, pagamento simulado, delivery, serviços, mesas e supermercado.",
  );
} finally {
  await browser.close();
}
