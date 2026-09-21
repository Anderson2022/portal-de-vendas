import "dotenv/config";
import { db } from "./index";
import {
  users,
  salespeople,
  customers,
  suppliers,
  productCategories,
  products,
  stockMovements,
  quotes,
  quoteItems,
  sales,
  saleItems,
  saleCosts,
  commissions,
  accountsReceivable,
  accountsPayable,
  workOrders,
  pools,
} from "./schema";
import { createHash } from "crypto";

const n = (v: number) => v.toFixed(2);
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

// PRNG determinístico para meses históricos
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260531);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

async function main() {
  console.log("Limpando tabelas...");
  await db.delete(stockMovements);
  await db.delete(saleCosts);
  await db.delete(saleItems);
  await db.delete(commissions);
  await db.delete(accountsReceivable);
  await db.delete(accountsPayable);
  await db.delete(workOrders);
  await db.delete(sales);
  await db.delete(quoteItems);
  await db.delete(quotes);
  await db.delete(products);
  await db.delete(productCategories);
  await db.delete(pools);
  await db.delete(customers);
  await db.delete(suppliers);
  await db.delete(salespeople);
  await db.delete(users);

  /* ── Vendedores ── */
  const sellers = await db
    .insert(salespeople)
    .values([
      { name: "Carla Mendes", email: "carla@piscinasazul.com.br", phone: "(11) 98812-4401", commissionPct: "5", monthlyGoal: "120000" },
      { name: "Ricardo Lima", email: "ricardo@piscinasazul.com.br", phone: "(11) 97745-2210", commissionPct: "5", monthlyGoal: "100000" },
      { name: "Fernanda Alves", email: "fernanda@piscinasazul.com.br", phone: "(11) 96633-8845", commissionPct: "4.5", monthlyGoal: "90000" },
      { name: "João Prado", email: "joao.prado@piscinasazul.com.br", phone: "(11) 95590-1177", commissionPct: "4", monthlyGoal: "70000" },
    ])
    .returning();
  const [carla, ricardo, fernanda, joao] = sellers;

  /* ── Usuários ── */
  await db.insert(users).values([
    { name: "Ricardo Silva", email: "ricardo@piscinasazul.com.br", login: "ricardo", passwordHash: sha("pool123"), role: "ADMIN" },
    { name: "Carla Mendes", email: "carla@piscinasazul.com.br", login: "carla", passwordHash: sha("pool123"), role: "VENDEDOR" },
    { name: "Fernanda Alves", email: "fernanda@piscinasazul.com.br", login: "fernanda", passwordHash: sha("pool123"), role: "VENDEDOR" },
    { name: "Bruno Castro", email: "bruno@piscinasazul.com.br", login: "bruno", passwordHash: sha("pool123"), role: "FINANCEIRO" },
    { name: "Renata Souza", email: "renata@piscinasazul.com.br", login: "renata", passwordHash: sha("pool123"), role: "ESTOQUISTA" },
    { name: "Marcos Vieira", email: "marcos.v@piscinasazul.com.br", login: "mvieira", passwordHash: sha("pool123"), role: "TECNICO" },
    { name: "Paula Nunes", email: "paula@piscinasazul.com.br", login: "paula", passwordHash: sha("pool123"), role: "GERENTE" },
  ]);

  /* ── Clientes ── */
  const cust = await db
    .insert(customers)
    .values([
      { name: "Marcos Oliveira", email: "marcos.oliveira@gmail.com", phone: "(11) 98122-3040", document: "312.455.908-02", address: "Rua das Palmeiras, 480 — Alphaville", city: "Barueri", state: "SP", createdAt: "2025-11-18" },
      { name: "Ana Paula Santos", email: "ana.santos@outlook.com", phone: "(11) 97410-5521", document: "287.140.663-10", address: "Al. Rio Negro, 1120 — Tamboré", city: "Santana de Parnaíba", state: "SP", createdAt: "2026-05-02" },
      { name: "Condomínio Riviera", email: "sindico@riviera.com.br", phone: "(11) 4102-8890", document: "04.918.220/0001-77", address: "Rod. Castello Branco, km 62", city: "Itupeva", state: "SP", createdAt: "2025-08-04" },
      { name: "Carlos Menezes", email: "carlos.menezes@gmail.com", phone: "(11) 99634-7120", document: "154.203.881-45", address: "Rua Bela Vista, 92", city: "Jundiaí", state: "SP", createdAt: "2026-05-05" },
      { name: "Juliana Costa", email: "ju.costa@gmail.com", phone: "(11) 98877-1934", document: "391.552.004-18", address: "Av. dos Ipês, 310", city: "Valinhos", state: "SP", createdAt: "2026-04-27" },
      { name: "Roberto Almeida", email: "roberto.almeida@uol.com.br", phone: "(11) 96550-4412", document: "220.118.745-63", address: "Rua Portugal, 58 — Centro", city: "Itu", state: "SP", createdAt: "2025-12-11" },
      { name: "Marina Duarte", email: "marina.duarte@gmail.com", phone: "(11) 97701-8230", document: "408.771.209-55", address: "Rua dos Lírios, 27", city: "Campinas", state: "SP", createdAt: "2026-05-09" },
      { name: "Eduardo Pires", email: "edu.pires@gmail.com", phone: "(11) 98245-6603", document: "133.905.412-87", address: "Estr. do Cafundá, 1400", city: "Mairinque", state: "SP", createdAt: "2026-03-14" },
      { name: "Sílvia Ramos", email: "silvia.ramos@gmail.com", phone: "(11) 99118-2276", document: "359.110.084-20", address: "Rua São Bento, 411", city: "Sorocaba", state: "SP", createdAt: "2026-05-16" },
      { name: "Hotel Fazenda Vale Azul", email: "compras@valeazul.com.br", phone: "(11) 4661-7732", document: "11.204.556/0001-09", address: "Rod. dos Bandeirantes, km 98", city: "Araçariguama", state: "SP", createdAt: "2025-06-22" },
      { name: "Casa de Campo Itu", email: "contato@casaitu.com.br", phone: "(11) 4024-1190", document: "27.880.431/0001-34", address: "Estr. da Fazendinha, km 4", city: "Itu", state: "SP", createdAt: "2026-05-20" },
      { name: "André Lima", email: "andre.lima@gmail.com", phone: "(11) 96420-7788", document: "275.664.930-01", address: "Rua XV de Novembro, 233", city: "Sorocaba", state: "SP", createdAt: "2026-05-11" },
      { name: "Patrícia Gomes", email: "patricia.gomes@gmail.com", phone: "(11) 98593-0042", document: "167.220.554-39", address: "Rua das Acácias, 76", city: "Vinhedo", state: "SP", createdAt: "2026-04-08" },
      { name: "José Carlos Ferreira", email: "ze.carlos@gmail.com", phone: "(11) 97306-5510", document: "211.084.336-74", address: "Av. Independência, 1500", city: "Indaiatuba", state: "SP", createdAt: "2025-09-30" },
      { name: "Condomínio Jardim das Águas", email: "adm@jardimdasaguas.com.br", phone: "(11) 4155-2043", document: "09.332.118/0001-52", address: "Rua das Águas, s/n", city: "Salto", state: "SP", createdAt: "2026-02-02" },
    ])
    .returning();
  const C = Object.fromEntries(cust.map((c) => [c.name, c.id]));

  /* ── Fornecedores ── */
  const sups = await db
    .insert(suppliers)
    .values([
      { name: "Hidro Bombas do Brasil", contact: "Sérgio Ramos", phone: "(11) 3522-7810", email: "vendas@hidrobombas.com.br", category: "Equipamentos", paymentTerms: "28 dias" },
      { name: "Química Pura", contact: "Lívia Antunes", phone: "(11) 2990-1145", email: "pedidos@quimicapura.com.br", category: "Produtos químicos", paymentTerms: "21 dias" },
      { name: "Fibra & Forma Piscinas", contact: "Otávio Nunes", phone: "(19) 3561-8820", email: "comercial@fibraforma.com.br", category: "Piscinas", paymentTerms: "35 dias" },
      { name: "Log Azul Transportes", contact: "Denis Prado", phone: "(11) 4788-0934", email: "ops@logazul.com.br", category: "Frete", paymentTerms: "15 dias" },
    ])
    .returning();
  const S = Object.fromEntries(sups.map((s) => [s.name, s.id]));

  /* ── Produtos ── */
  const cats = await db
    .insert(productCategories)
    .values([{ name: "Químicos" }, { name: "Equipamentos" }, { name: "Acessórios" }, { name: "Peças" }, { name: "Piscinas" }])
    .returning();
  const catId = (name: string) => cats.find((c) => c.name === name)!.id;

  const prods = await db
    .insert(products)
    .values([
      { sku: "QUI-001", name: "Cloro granulado 10 kg", categoryId: catId("Químicos"), unit: "bd", salePrice: "289.90", avgCost: "172.00", lastCost: "178.00", stock: 46, reserved: 12, minStock: 20 },
      { sku: "QUI-002", name: "Barrilha leve 5 kg", categoryId: catId("Químicos"), unit: "sc", salePrice: "74.90", avgCost: "41.20", lastCost: "43.00", stock: 18, reserved: 4, minStock: 20 },
      { sku: "QUI-003", name: "Algicida de choque 1 L", categoryId: catId("Químicos"), unit: "un", salePrice: "52.90", avgCost: "27.40", lastCost: "28.10", stock: 60, reserved: 0, minStock: 15 },
      { sku: "QUI-004", name: "Clarificante líquido 1 L", categoryId: catId("Químicos"), unit: "un", salePrice: "39.90", avgCost: "19.80", lastCost: "20.40", stock: 12, reserved: 2, minStock: 15 },
      { sku: "EQU-001", name: "Motor/bomba 1/3 CV", categoryId: catId("Equipamentos"), unit: "un", salePrice: "899.00", avgCost: "512.00", lastCost: "530.00", stock: 14, reserved: 5, minStock: 6 },
      { sku: "EQU-002", name: "Motor/bomba 1/2 CV", categoryId: catId("Equipamentos"), unit: "un", salePrice: "1190.00", avgCost: "714.00", lastCost: "722.00", stock: 9, reserved: 2, minStock: 5 },
      { sku: "EQU-003", name: "Filtro de areia TP-40", categoryId: catId("Equipamentos"), unit: "un", salePrice: "1450.00", avgCost: "890.00", lastCost: "905.00", stock: 7, reserved: 3, minStock: 4 },
      { sku: "EQU-004", name: "Aquecedor a gás 60k BTU", categoryId: catId("Equipamentos"), unit: "un", salePrice: "7890.00", avgCost: "5340.00", lastCost: "5410.00", stock: 3, reserved: 1, minStock: 2 },
      { sku: "ACE-001", name: "Kit limpeza completo", categoryId: catId("Acessórios"), unit: "kt", salePrice: "449.90", avgCost: "256.00", lastCost: "262.00", stock: 22, reserved: 6, minStock: 10 },
      { sku: "ACE-002", name: "Mangueira flutuante 15 m", categoryId: catId("Acessórios"), unit: "un", salePrice: "189.90", avgCost: "104.00", lastCost: "108.00", stock: 31, reserved: 0, minStock: 12 },
      { sku: "ACE-003", name: "Tampa térmica 500 micras (m²)", categoryId: catId("Acessórios"), unit: "m²", salePrice: "89.90", avgCost: "51.00", lastCost: "53.00", stock: 140, reserved: 18, minStock: 60 },
      { sku: "ACE-004", name: "Refletor LED RGB 9W", categoryId: catId("Acessórios"), unit: "un", salePrice: "329.90", avgCost: "188.00", lastCost: "194.00", stock: 8, reserved: 3, minStock: 8 },
      { sku: "PEC-001", name: "Areia filtrante 25 kg", categoryId: catId("Peças"), unit: "sc", salePrice: "64.90", avgCost: "32.10", lastCost: "33.40", stock: 40, reserved: 8, minStock: 20 },
      { sku: "PEC-002", name: "Cesto pré-filtro universal", categoryId: catId("Peças"), unit: "un", salePrice: "42.90", avgCost: "21.50", lastCost: "22.00", stock: 6, reserved: 0, minStock: 10 },
      { sku: "PIS-001", name: "Piscina Atlântica 7x3 (fibra)", categoryId: catId("Piscinas"), unit: "un", salePrice: "28920.00", avgCost: "14500.00", lastCost: "14500.00", stock: 2, reserved: 1, minStock: 1 },
      { sku: "PIS-002", name: "Piscina Compacta 5x2 (fibra)", categoryId: catId("Piscinas"), unit: "un", salePrice: "21400.00", avgCost: "10900.00", lastCost: "10900.00", stock: 3, reserved: 1, minStock: 1 },
    ])
    .returning();
  const P = Object.fromEntries(prods.map((p) => [p.sku, p]));

  /* ── Modelos de piscinas ── */
  await db.insert(pools).values([
    { name: "Atlântica 7x3", sizeLabel: "7,0 × 3,0 × 1,40 m", volumeLiters: 26500, material: "Fibra", equipment: "Motor 1/3 CV · Filtro TP-40 · 3 refletores LED", warrantyMonths: 84, basePrice: "28920.00" },
    { name: "Compacta 5x2", sizeLabel: "5,0 × 2,4 × 1,30 m", volumeLiters: 13900, material: "Fibra", equipment: "Motor 1/3 CV · Filtro TP-30 · 2 refletores LED", warrantyMonths: 84, basePrice: "21400.00" },
    { name: "Lebron 6 m", sizeLabel: "6,0 × 3,0 × 1,40 m", volumeLiters: 22800, material: "Fibra", equipment: "Motor 1/2 CV · Filtro TP-40 · Cascata inox", warrantyMonths: 84, basePrice: "26100.00" },
    { name: "Caribe 8x4", sizeLabel: "8,0 × 4,0 × 1,45 m", volumeLiters: 41200, material: "Fibra", equipment: "Motor 1/2 CV · Filtro TP-50 · 4 refletores LED", warrantyMonths: 84, basePrice: "38900.00" },
    { name: "Riviera Coletiva 12x5", sizeLabel: "12,0 × 5,0 × 1,50 m", volumeLiters: 81000, material: "Alvenaria", equipment: "2 motores 3/4 CV · Filtro TP-60 · Clorador automático", warrantyMonths: 120, basePrice: "96400.00" },
    { name: "Splash Kids 4x2", sizeLabel: "4,0 × 2,0 × 0,80 m", volumeLiters: 5200, material: "Vinil", equipment: "Motor 1/4 CV · Filtro TP-25", warrantyMonths: 36, basePrice: "12800.00" },
  ]);

  /* ── Movimentações de estoque ── */
  const mov = (
    sku: string,
    type: string,
    quantity: number,
    reason: string,
    reference: string | null,
    date: string
  ) => ({ productId: P[sku].id, type, quantity, reason, reference, createdBy: "Renata Souza", createdAt: date });
  await db.insert(stockMovements).values([
    mov("QUI-001", "ENTRADA", 40, "Compra — Nota fiscal 88.112", "NF 88.112 · Química Pura", "2026-05-03"),
    mov("QUI-001", "SAIDA", 3, "Baixa automática", "Venda #3120", "2026-05-08"),
    mov("QUI-001", "SAIDA", 2, "Baixa automática", "OS #1004", "2026-05-09"),
    mov("QUI-001", "RESERVA", 12, "Reserva de orçamentos aprovados", "Vendas abertas", "2026-05-12"),
    mov("QUI-002", "SAIDA", 6, "Baixa automática", "Venda #3121", "2026-05-12"),
    mov("QUI-004", "SAIDA", 4, "Consumo de manutenção", "OS #1006", "2026-05-14"),
    mov("EQU-001", "ENTRADA", 10, "Compra programada", "NF 51.908 · Hidro Bombas", "2026-05-05"),
    mov("EQU-001", "SAIDA", 1, "Baixa por instalação", "Venda #3127", "2026-05-18"),
    mov("EQU-003", "RESERVA", 3, "Reserva — instalações da semana", "OS #1011 · OS #1012", "2026-05-19"),
    mov("ACE-001", "SAIDA", 4, "Venda balcão + kits de entrega", "Venda #3123", "2026-05-13"),
    mov("ACE-004", "SAIDA", 2, "Modernização de iluminação", "Venda #3126", "2026-05-20"),
    mov("PEC-002", "SAIDA", 4, "Reposição em manutenções", "OS #1007", "2026-05-15"),
    mov("QUI-001", "AJUSTE", -2, "Inventário — embalagem avariada", "INV 05/2026", "2026-05-21"),
    mov("ACE-003", "ENTRADA", 60, "Compra — rolo 500 micras", "NF 22.441", "2026-05-10"),
    mov("PIS-001", "SAIDA", 1, "Instalação Cond. Riviera (etapa 1)", "Venda #3127", "2026-05-18"),
  ]);

  /* ── Orçamentos (funil) ── */
  let qNum = 3101;
  type Q = { customer: string; project: string; status: string; total: number; date: string; seller?: number };
  const qList: Q[] = [
    // LEADS
    { customer: "Condomínio Jardim das Águas", project: "Spa aquecido comunitário", status: "LEAD", total: 86500, date: "2026-05-02" },
    { customer: "José Carlos Ferreira", project: "Piscina Lebron 6 m", status: "LEAD", total: 31800, date: "2026-05-03" },
    { customer: "Patrícia Gomes", project: "Troca de vinil + LED", status: "LEAD", total: 9400, date: "2026-05-04" },
    { customer: "Sílvia Ramos", project: "Piscina Splash Kids", status: "LEAD", total: 15200, date: "2026-05-06" },
    { customer: "Eduardo Pires", project: "Aquecimento solar 12 placas", status: "LEAD", total: 11800, date: "2026-05-07" },
    { customer: "Marina Duarte", project: "Piscina Caribe 8x4", status: "LEAD", total: 52300, date: "2026-05-08" },
    { customer: "André Lima", project: "Reforma completa de deck", status: "LEAD", total: 18700, date: "2026-05-10" },
    { customer: "Casa de Campo Itu", project: "Cascata + prainha", status: "LEAD", total: 22900, date: "2026-05-11" },
    { customer: "Ana Paula Santos", project: "Paisagismo molhado", status: "LEAD", total: 14100, date: "2026-05-12" },
    { customer: "Hotel Fazenda Vale Azul", project: "Piscina infantil 60 m²", status: "LEAD", total: 74200, date: "2026-05-13" },
    { customer: "Carlos Menezes", project: "Robô limpador premium", status: "LEAD", total: 6900, date: "2026-05-14" },
    { customer: "Juliana Costa", project: "Spa de hidromassagem", status: "LEAD", total: 27400, date: "2026-05-15" },
    // ORÇAMENTOS
    { customer: "Ana Paula Santos", project: "Piscina Residencial 7x3", status: "ORCAMENTO", total: 42800, date: "2026-05-12", seller: carla.id },
    { customer: "Carlos Menezes", project: "Aquecimento + acessórios", status: "ORCAMENTO", total: 18750, date: "2026-05-10", seller: ricardo.id },
    { customer: "Sílvia Ramos", project: "Piscina Compacta 5x2", status: "ORCAMENTO", total: 24900, date: "2026-05-08", seller: joao.id },
    { customer: "Eduardo Pires", project: "Troca de motores (2 un.)", status: "ORCAMENTO", total: 3180, date: "2026-05-09", seller: fernanda.id },
    { customer: "André Lima", project: "Kit verão premium", status: "ORCAMENTO", total: 2140, date: "2026-05-13", seller: ricardo.id },
    { customer: "Patrícia Gomes", project: "Manutenção trimestral", status: "ORCAMENTO", total: 1890, date: "2026-05-14", seller: joao.id },
    { customer: "Marina Duarte", project: "Iluminação subaquática RGB", status: "ORCAMENTO", total: 4680, date: "2026-05-15", seller: carla.id },
    { customer: "Casa de Campo Itu", project: "Clorador automático", status: "ORCAMENTO", total: 7340, date: "2026-05-16", seller: fernanda.id },
    { customer: "Condomínio Jardim das Águas", project: "Contrato anual de zeladoria", status: "ORCAMENTO", total: 38400, date: "2026-05-17", seller: ricardo.id },
    { customer: "José Carlos Ferreira", project: "Filtro TP-50 + instalação", status: "ORCAMENTO", total: 2890, date: "2026-05-18", seller: joao.id },
    { customer: "Hotel Fazenda Vale Azul", project: "Raia de natação sob medida", status: "ORCAMENTO", total: 58700, date: "2026-05-19", seller: carla.id },
    { customer: "Juliana Costa", project: "Tampa térmica sob medida", status: "ORCAMENTO", total: 1880, date: "2026-05-20", seller: fernanda.id },
    // NEGOCIAÇÃO
    { customer: "Condomínio Riviera", project: "Piscina Coletiva 12x5", status: "NEGOCIACAO", total: 128500, date: "2026-05-11", seller: ricardo.id },
    { customer: "Juliana Costa", project: "Piscina Compacta 5x2", status: "NEGOCIACAO", total: 36900, date: "2026-05-09", seller: carla.id },
    { customer: "Marina Duarte", project: "Piscina Lebron 6 m", status: "NEGOCIACAO", total: 31200, date: "2026-05-12", seller: fernanda.id },
    { customer: "Eduardo Pires", project: "Aquecimento a gás + casa de máquinas", status: "NEGOCIACAO", total: 14200, date: "2026-05-13", seller: ricardo.id },
    { customer: "Sílvia Ramos", project: "Reforma de revestimento", status: "NEGOCIACAO", total: 11900, date: "2026-05-15", seller: carla.id },
    { customer: "André Lima", project: "Spa acoplado 6 lugares", status: "NEGOCIACAO", total: 19800, date: "2026-05-16", seller: joao.id },
    { customer: "Casa de Campo Itu", project: "Prainha com hidromassagem", status: "NEGOCIACAO", total: 16400, date: "2026-05-18", seller: carla.id },
    { customer: "Patrícia Gomes", project: "Automação completa", status: "NEGOCIACAO", total: 8900, date: "2026-05-19", seller: ricardo.id },
    // FECHADO / CANCELADO (histórico recente)
    { customer: "Roberto Almeida", project: "Reforma e modernização", status: "FECHADO", total: 27400, date: "2026-05-08", seller: ricardo.id },
    { customer: "Marcos Oliveira", project: "Piscina Atlântica 7x3 completa", status: "FECHADO", total: 41700, date: "2026-05-06", seller: carla.id },
    { customer: "Hotel Fazenda Vale Azul", project: "Reposição de casa de máquinas", status: "FECHADO", total: 12800, date: "2026-04-28", seller: fernanda.id },
    { customer: "Carlos Menezes", project: "Deck modular", status: "CANCELADO", total: 9800, date: "2026-05-05", seller: joao.id },
    { customer: "Condomínio Riviera", project: "Troca de revestimento infantil", status: "CANCELADO", total: 21400, date: "2026-04-30", seller: ricardo.id },
  ];

  const quoteRows: { id: number; number: number; total: string }[] = [];
  for (const q of qList) {
    const [row] = await db
      .insert(quotes)
      .values({
        number: q.customer === "Ana Paula Santos" && q.status === "ORCAMENTO" ? 3156
          : q.customer === "Condomínio Riviera" && q.status === "NEGOCIACAO" ? 3155
          : q.customer === "Carlos Menezes" && q.status === "ORCAMENTO" ? 3154
          : q.customer === "Juliana Costa" && q.status === "NEGOCIACAO" ? 3153
          : q.customer === "Roberto Almeida" ? 3152
          : qNum++,
        customerId: C[q.customer],
        salespersonId: q.seller ?? null,
        project: q.project,
        status: q.status,
        total: n(q.total),
        validUntil: "2026-06-15",
        createdAt: q.date,
      })
      .returning();
    quoteRows.push(row);
    await db.insert(quoteItems).values([
      { quoteId: row.id, description: q.project, qty: 1, unitPrice: n(q.total * 0.92), unitCost: n(q.total * 0.52) },
      { quoteId: row.id, description: "Instalação e acabamento", qty: 1, unitPrice: n(q.total * 0.08), unitCost: n(q.total * 0.04) },
    ]);
  }

  /* ── Vendas ──
     Helper que cria venda completa: itens, custos, comissão, recebíveis */
  let saleSeq = 3000;
  type Item = { desc: string; qty: number; price: number; cost: number; productId?: number };
  async function createSale(opts: {
    customer: string; sellerId: number; sellerPct: number; date: string;
    items: Item[]; freight: number; cardFeePct: number; taxPct: number;
    status?: string; payment: string; number?: number; quoteId?: number | null;
    paidInFull?: boolean;
  }) {
    const number = opts.number ?? saleSeq++;
    const total = opts.items.reduce((s, i) => s + i.price * i.qty, 0) + opts.freight;
    const productCost = opts.items.reduce((s, i) => s + i.cost * i.qty, 0);
    const commission = total * (opts.sellerPct / 100);
    const cardFee = total * (opts.cardFeePct / 100);
    const tax = total * (opts.taxPct / 100);
    const totalCost = productCost + opts.freight * 0.76 + commission + cardFee + tax;
    const profit = total - totalCost;
    const margin = (profit / total) * 100;

    const [sale] = await db
      .insert(sales)
      .values({
        number,
        customerId: C[opts.customer],
        salespersonId: opts.sellerId,
        quoteId: opts.quoteId ?? null,
        status: opts.status ?? "FECHADA",
        saleDate: opts.date,
        totalValue: n(total),
        totalCost: n(totalCost),
        commission: n(commission),
        profit: n(profit),
        margin: n(margin),
        paymentSummary: opts.payment,
      })
      .returning();

    await db.insert(saleItems).values(
      opts.items.map((i) => ({
        saleId: sale.id, productId: i.productId ?? null, description: i.desc,
        qty: i.qty, unitPrice: n(i.price), unitCost: n(i.cost),
      }))
    );

    const costs: { saleId: number; type: string; description: string; amount: string }[] =
      opts.items.map((i) => ({
        saleId: sale.id, type: "PRODUCT", description: `Custo — ${i.desc}`, amount: n(i.cost * i.qty),
      }));
    if (opts.freight > 0) costs.push({ saleId: sale.id, type: "FREIGHT", description: "Frete e içamento", amount: n(opts.freight * 0.76) });
    costs.push({ saleId: sale.id, type: "COMMISSION", description: `Comissão do vendedor (${opts.sellerPct}%)`, amount: n(commission) });
    costs.push({ saleId: sale.id, type: "TAX", description: `Impostos (${opts.taxPct}%)`, amount: n(tax) });
    costs.push({ saleId: sale.id, type: "CARD_FEE", description: `Taxa do cartão (${opts.cardFeePct}%)`, amount: n(cardFee) });
    await db.insert(saleCosts).values(costs);

    await db.insert(commissions).values({
      saleId: sale.id,
      salespersonId: opts.sellerId,
      pct: n(opts.sellerPct),
      amount: n(commission),
      month: opts.date.slice(0, 7),
      status: opts.paidInFull ? "PAGA" : "PENDENTE",
    });

    // Recebíveis: entrada 30% + restante em parcelas
    const entrada = Math.round(total * 0.3 * 100) / 100;
    const rest = total - entrada;
    const parcels = total > 10000 ? 4 : 2;
    const per = Math.round((rest / parcels) * 100) / 100;
    const [y, m] = opts.date.split("-").map(Number);
    const dstr = (dy: number, mo: number) => {
      const mm = ((mo - 1 + dy) % 12) + 1;
      const yy = y + Math.floor((mo - 1 + dy) / 12);
      return `${yy}-${String(mm).padStart(2, "0")}-10`;
    };
    const recv: {
      saleId: number; customerId: number; description: string; amount: string;
      method: string; dueDate: string; paidAt: string | null; status: string;
    }[] = [];
    const hist = opts.paidInFull;
    recv.push({
      saleId: sale.id, customerId: C[opts.customer], description: `Entrada — Venda #${number}`,
      amount: n(entrada), method: "PIX", dueDate: opts.date,
      paidAt: hist ? opts.date : opts.date <= "2026-05-31" ? opts.date : null,
      status: hist || opts.date <= "2026-05-31" ? "RECEBIDO" : "PENDENTE",
    });
    for (let i = 1; i <= parcels; i++) {
      const due = dstr(i, m);
      const pago = hist || due <= "2026-05-31";
      recv.push({
        saleId: sale.id, customerId: C[opts.customer],
        description: `Parcela ${i}/${parcels} — Venda #${number}`, amount: n(per),
        method: total > 10000 ? "CARTAO" : "BOLETO", dueDate: due,
        paidAt: hist ? due : pago ? due : null,
        status: hist ? "RECEBIDO" : pago ? "RECEBIDO" : "PENDENTE",
      });
    }
    await db.insert(accountsReceivable).values(recv);
    return { sale, total };
  }

  /* Venda destaque — #3127 Marcos Oliveira (spec) */
  const atlanticaQuote = quoteRows.find((q) => q.total === "41700.00");
  await createSale({
    customer: "Marcos Oliveira", sellerId: carla.id, sellerPct: 5,
    date: "2026-05-16", number: 3127, quoteId: atlanticaQuote?.id ?? null,
    items: [
      { desc: "Piscina Atlântica 7x3 (fibra)", qty: 1, price: 28920, cost: 14500, productId: P["PIS-001"].id },
      { desc: "Motor e bomba 1/3 CV", qty: 1, price: 4250, cost: 2350, productId: P["EQU-001"].id },
      { desc: "Kit limpeza completo", qty: 1, price: 1180, cost: 480, productId: P["ACE-001"].id },
      { desc: "Instalação e mão de obra", qty: 1, price: 6500, cost: 1380 },
    ],
    freight: 850, cardFeePct: 2.9, taxPct: 8.5,
    payment: "Entrada R$ 12.510 + 4x cartão",
  });

  /* Demais 8 vendas de maio/2026 — somam R$ 86.250 com a #3127 */
  const robertoQuote = quoteRows.find((q) => q.total === "27400.00");
  await createSale({
    customer: "Roberto Almeida", sellerId: ricardo.id, sellerPct: 5,
    date: "2026-05-14", number: 3126, quoteId: robertoQuote?.id ?? null,
    items: [
      { desc: "Reforma e modernização — pacote", qty: 1, price: 24000, cost: 12100 },
      { desc: "Refletores LED RGB (6 un.)", qty: 1, price: 2600, cost: 1180, productId: P["ACE-004"].id },
    ],
    freight: 800, cardFeePct: 2.9, taxPct: 8.5,
    payment: "Entrada R$ 8.220 + 4x cartão",
  });
  await createSale({
    customer: "Sílvia Ramos", sellerId: joao.id, sellerPct: 4,
    date: "2026-05-03", number: 3119,
    items: [{ desc: "Filtro TP-40 + bomba 1/3 CV", qty: 1, price: 4250, cost: 2640, productId: P["EQU-003"].id }],
    freight: 280, cardFeePct: 2.9, taxPct: 8.5, payment: "Entrada R$ 1.275 + 2x boleto",
  });
  await createSale({
    customer: "Eduardo Pires", sellerId: fernanda.id, sellerPct: 4.5,
    date: "2026-05-05", number: 3120,
    items: [
      { desc: "Kit químico trimestral", qty: 1, price: 2640, cost: 1420, productId: P["QUI-001"].id },
      { desc: "Troca de areia do filtro", qty: 1, price: 840, cost: 390, productId: P["PEC-001"].id },
    ],
    freight: 160, cardFeePct: 1.9, taxPct: 8.5, payment: "Entrada 30% + 2x cartão",
  });
  await createSale({
    customer: "Marina Duarte", sellerId: carla.id, sellerPct: 5,
    date: "2026-05-07", number: 3121,
    items: [
      { desc: "Aquecedor solar — 6 placas", qty: 1, price: 2980, cost: 1520 },
    ],
    freight: 270, cardFeePct: 2.9, taxPct: 8.5, payment: "PIX à vista",
  });
  await createSale({
    customer: "José Carlos Ferreira", sellerId: ricardo.id, sellerPct: 5,
    date: "2026-05-10", number: 3122,
    items: [{ desc: "Motor 1/2 CV + instalação", qty: 1, price: 2240, cost: 1230, productId: P["EQU-002"].id }],
    freight: 140, cardFeePct: 2.9, taxPct: 8.5, payment: "Entrada 30% + 2x boleto",
  });
  await createSale({
    customer: "Patrícia Gomes", sellerId: fernanda.id, sellerPct: 4.5,
    date: "2026-05-12", number: 3123,
    items: [
      { desc: "Mangueira flutuante 15 m (2)", qty: 2, price: 189.9, cost: 104, productId: P["ACE-002"].id },
      { desc: "Algicida de choque 1 L (6)", qty: 6, price: 52.9, cost: 27.4, productId: P["QUI-003"].id },
      { desc: "Limpeza pós-obra", qty: 1, price: 622.8, cost: 300 },
    ],
    freight: 120, cardFeePct: 1.9, taxPct: 8.5, payment: "Entrada 30% + 2x cartão",
  });
  await createSale({
    customer: "Casa de Campo Itu", sellerId: joao.id, sellerPct: 4,
    date: "2026-05-13", number: 3124,
    items: [{ desc: "Revisão de casa de máquinas", qty: 1, price: 530, cost: 290, productId: P["PEC-002"].id }],
    freight: 120, cardFeePct: 2.9, taxPct: 8.5, payment: "Boleto 2x",
  });
  await createSale({
    customer: "André Lima", sellerId: ricardo.id, sellerPct: 5,
    date: "2026-05-15", number: 3125,
    items: [{ desc: "Combo químicos premium", qty: 1, price: 1140, cost: 610, productId: P["QUI-004"].id }],
    freight: 120, cardFeePct: 2.9, taxPct: 8.5, payment: "Entrada 30% + 2x cartão",
  });

  /* Vendas históricas (12 meses) para gráficos */
  const histNames = Object.keys(C);
  const histValues = [1980, 2450, 3120, 3980, 4260, 5190, 6740, 7820, 9480, 12400, 15800, 18900];
  const months = [
    "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11",
    "2025-12", "2026-01", "2026-02", "2026-03", "2026-04",
  ];
  const growth = [0.55, 0.6, 0.66, 0.72, 0.8, 0.95, 1.15, 0.7, 0.78, 0.88, 0.96];
  const sellerPool = [
    { s: carla, pct: 5 }, { s: ricardo, pct: 5 }, { s: fernanda, pct: 4.5 }, { s: joao, pct: 4 },
  ];
  const prodPool = [P["QUI-001"], P["EQU-001"], P["EQU-002"], P["EQU-003"], P["ACE-001"], P["ACE-002"], P["QUI-003"], P["PEC-001"]];
  for (let mi = 0; mi < months.length; mi++) {
    const count = 5 + Math.floor(rand() * 4);
    for (let i = 0; i < count; i++) {
      const sp = sellerPool[Math.floor(rand() * sellerPool.length)];
      const base = pick(histValues);
      const total = Math.round(base * growth[mi] * (0.85 + rand() * 0.3));
      const day = 3 + Math.floor(rand() * 24);
      const pr = pick(prodPool);
      const price = Number(pr.salePrice);
      const qty = Math.max(1, Math.min(4, Math.round(total / price)));
      await createSale({
        customer: pick(histNames), sellerId: sp.s.id, sellerPct: sp.pct,
        date: `${months[mi]}-${String(day).padStart(2, "0")}`,
        items: [
          { desc: pr.name, qty, price, cost: Number(pr.avgCost), productId: pr.id },
          ...(total / qty > price * 1.8
            ? [{ desc: "Serviço de instalação", qty: 1, price: total - qty * price, cost: (total - qty * price) * 0.45 }]
            : []),
        ],
        freight: total > 6000 ? 350 : 120,
        cardFeePct: 2.9, taxPct: 8.5,
        payment: "Parcelado",
        paidInFull: true,
      });
    }
  }

  /* ── Contas a pagar ── */
  await db.insert(accountsPayable).values([
    { supplierId: S["Fibra & Forma Piscinas"], description: "Piscina Atlântica 7x3 — NF 18.772", category: "Mercadorias", amount: "14500.00", dueDate: "2026-05-20", paidAt: "2026-05-19", status: "PAGO" },
    { supplierId: S["Hidro Bombas do Brasil"], description: "Motores 1/3 e 1/2 CV — NF 51.908", category: "Mercadorias", amount: "8400.00", dueDate: "2026-06-05", status: "PENDENTE" },
    { supplierId: S["Química Pura"], description: "Cloro e químicos — NF 88.112", category: "Mercadorias", amount: "3280.00", dueDate: "2026-05-24", status: "PENDENTE" },
    { supplierId: S["Log Azul Transportes"], description: "Fretes de maio", category: "Frete", amount: "2140.00", dueDate: "2026-05-28", status: "PENDENTE" },
    { supplierId: null as unknown as number, description: "Folha de pagamento — maio", category: "Pessoal", amount: "22700.00", dueDate: "2026-06-05", status: "PENDENTE" },
    { supplierId: null as unknown as number, description: "Energia elétrica — showroom", category: "Operacional", amount: "1450.00", dueDate: "2026-05-12", paidAt: "2026-05-12", status: "PAGO" },
    { supplierId: null as unknown as number, description: "Aluguel — loja e galpão", category: "Operacional", amount: "4800.00", dueDate: "2026-05-10", paidAt: "2026-05-10", status: "PAGO" },
    { supplierId: null as unknown as number, description: "Tráfego pago e anúncios", category: "Marketing", amount: "1950.00", dueDate: "2026-05-08", status: "VENCIDO" },
    { supplierId: null as unknown as number, description: "Telefonia e internet", category: "Operacional", amount: "620.00", dueDate: "2026-06-10", status: "PENDENTE" },
    { supplierId: S["Química Pura"], description: "Algicidas — NF 88.390", category: "Mercadorias", amount: "1120.00", dueDate: "2026-05-06", status: "VENCIDO" },
  ]);

  /* Recebíveis vencidos adicionais (drama realista) */
  await db.insert(accountsReceivable).values([
    { saleId: null as unknown as number, customerId: C["Patrícia Gomes"], description: "Manutenção mensal — abril", amount: "480.00", method: "BOLETO", dueDate: "2026-05-05", status: "VENCIDO" },
    { saleId: null as unknown as number, customerId: C["Condomínio Jardim das Águas"], description: "Contrato zeladoria — parcela 3", amount: "2900.00", method: "BOLETO", dueDate: "2026-05-10", status: "VENCIDO" },
  ]);

  /* ── Ordens de serviço ── */
  const wo = (v: {
    customer: string; type: string; technician: string; team?: string; status: string;
    date: string; time: string; address: string; pool?: string; notes?: string; saleId?: number;
  }) => ({
    number: 1000, ...v,
  });
  const [s3127] = await db.select({ id: sales.id }).from(sales);
  void s3127;
  const woList = [
    { number: 1012, customerId: C["Marcos Oliveira"], type: "INSTALACAO", technician: "Marcos Vieira", team: "Equipe A", status: "EXECUCAO", scheduledDate: "2026-05-28", timeSlot: "Manhã", address: "Rua das Palmeiras, 480 — Alphaville, Barueri", poolModel: "Atlântica 7x3", notes: "Içamento agendado para 9h. Cliente solicitou fita antiderrapante na borda.", createdAt: "2026-05-17" },
    { number: 1011, customerId: C["Roberto Almeida"], type: "INSTALACAO", technician: "Marcos Vieira", team: "Equipe B", status: "AGENDADA", scheduledDate: "2026-05-29", timeSlot: "Tarde", address: "Rua Portugal, 58 — Centro, Itu", poolModel: "Reforma + LED", notes: "Finalizar troca dos refletores e testar automação.", createdAt: "2026-05-15" },
    { number: 1010, customerId: C["Sílvia Ramos"], type: "MANUTENCAO", technician: "Diego Santos", status: "AGENDADA", scheduledDate: "2026-05-30", timeSlot: "Manhã", address: "Rua São Bento, 411 — Sorocaba", poolModel: "Compacta 5x2", notes: "Trocar areia do filtro e revisar vedação.", createdAt: "2026-05-16" },
    { number: 1009, customerId: C["Ana Paula Santos"], type: "LIMPEZA", technician: "Diego Santos", status: "DESLOCAMENTO", scheduledDate: "2026-05-27", timeSlot: "Tarde", address: "Al. Rio Negro, 1120 — Tamboré", notes: "Limpeza pós-reforma com aspiração de fundo.", createdAt: "2026-05-20" },
    { number: 1008, customerId: C["Condomínio Riviera"], type: "MANUTENCAO", technician: "Equipe C", status: "EXECUCAO", scheduledDate: "2026-05-27", timeSlot: "Integral", address: "Rod. Castello Branco, km 62 — Itupeva", poolModel: "Coletiva 12x5", notes: "Balanceamento químico mensal + inspeção da casa de máquinas.", createdAt: "2026-05-19" },
    { number: 1007, customerId: C["Patrícia Gomes"], type: "REPARO", technician: "Marcos Vieira", status: "PAUSADA", scheduledDate: "2026-05-26", timeSlot: "Manhã", address: "Rua das Acácias, 76 — Vinhedo", notes: "Aguardando cesto pré-filtro chegar do fornecedor.", createdAt: "2026-05-14" },
    { number: 1006, customerId: C["Hotel Fazenda Vale Azul"], type: "MANUTENCAO", technician: "Equipe C", status: "CONCLUIDA", scheduledDate: "2026-05-21", timeSlot: "Manhã", address: "Rod. dos Bandeirantes, km 98", poolModel: "Olímpica", notes: "Checklist assinado pelo zelador. Fotos anexadas.", createdAt: "2026-05-10" },
    { number: 1005, customerId: C["Juliana Costa"], type: "LIMPEZA", technician: "Diego Santos", status: "CONCLUIDA", scheduledDate: "2026-05-20", timeSlot: "Tarde", address: "Av. dos Ipês, 310 — Valinhos", notes: "pH ajustado. Cliente avaliou 5 estrelas.", createdAt: "2026-05-09" },
    { number: 1004, customerId: C["Eduardo Pires"], type: "MANUTENCAO", technician: "Marcos Vieira", status: "CONCLUIDA", scheduledDate: "2026-05-13", timeSlot: "Manhã", address: "Estr. do Cafundá, 1400 — Mairinque", notes: "Troca de o-rings e régua de iodo.", createdAt: "2026-05-06" },
    { number: 1003, customerId: C["André Lima"], type: "REPARO", technician: "Diego Santos", status: "PENDENTE", scheduledDate: "2026-06-02", timeSlot: "Manhã", address: "Rua XV de Novembro, 233 — Sorocaba", notes: "Vazamento no ralo de fundo — prioridade.", createdAt: "2026-05-22" },
    { number: 1002, customerId: C["Casa de Campo Itu"], type: "LIMPEZA", technician: "Equipe C", status: "CANCELADA", scheduledDate: "2026-05-18", timeSlot: "Tarde", address: "Estr. da Fazendinha, km 4 — Itu", notes: "Cliente remarcou para junho.", createdAt: "2026-05-08" },
  ].map((w) => ({ ...wo(w as never), number: w.number, customerId: w.customerId })) as never[];
  await db.insert(workOrders).values(woList);

  console.log("Seed concluído com sucesso.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
