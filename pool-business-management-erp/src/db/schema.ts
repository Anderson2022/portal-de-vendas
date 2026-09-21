import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/* ─────────────────────────── Usuários / equipe ─────────────────────────── */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  login: varchar("login", { length: 60 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 128 }).notNull(),
  role: varchar("role", { length: 30 }).notNull().default("VENDEDOR"), // ADMIN | GERENTE | VENDEDOR | FINANCEIRO | ESTOQUISTA | TECNICO | CAIXA
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const salespeople = pgTable("salespeople", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 30 }),
  commissionPct: numeric("commission_pct", { precision: 5, scale: 2 })
    .notNull()
    .default("5"),
  monthlyGoal: numeric("monthly_goal", { precision: 12, scale: 2 })
    .notNull()
    .default("100000"),
  active: boolean("active").notNull().default(true),
});

/* ─────────────────────────── Clientes / fornecedores ─────────────────────────── */

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 30 }),
  document: varchar("document", { length: 20 }), // CPF/CNPJ
  address: varchar("address", { length: 220 }),
  city: varchar("city", { length: 90 }),
  state: varchar("state", { length: 2 }),
  notes: text("notes"),
  createdAt: varchar("created_at", { length: 10 }).notNull(), // YYYY-MM-DD
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  contact: varchar("contact", { length: 120 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 160 }),
  category: varchar("category", { length: 60 }),
  paymentTerms: varchar("payment_terms", { length: 60 }),
});

/* ─────────────────────────── Produtos / estoque ─────────────────────────── */

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 24 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  categoryId: integer("category_id").references(() => productCategories.id),
  unit: varchar("unit", { length: 10 }).notNull().default("un"),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  avgCost: numeric("avg_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  lastCost: numeric("last_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  stock: integer("stock").notNull().default(0), // físico
  reserved: integer("reserved").notNull().default(0), // reservado
  minStock: integer("min_stock").notNull().default(0), // mínimo
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  type: varchar("type", { length: 12 }).notNull(), // ENTRADA | SAIDA | AJUSTE | RESERVA | LIBERACAO
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  reference: varchar("reference", { length: 40 }), // Venda #3127, OS #104...
  createdBy: varchar("created_by", { length: 80 }),
  createdAt: varchar("created_at", { length: 10 }).notNull(),
});

/* ─────────────────────────── Orçamentos ─────────────────────────── */

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  salespersonId: integer("salesperson_id").references(() => salespeople.id),
  project: varchar("project", { length: 180 }).notNull(),
  notes: text("notes").notNull().default(""),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  status: varchar("status", { length: 14 }).notNull().default("ORCAMENTO"), // LEAD | ORCAMENTO | NEGOCIACAO | FECHADO | CANCELADO
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  validUntil: varchar("valid_until", { length: 10 }),
  createdAt: varchar("created_at", { length: 10 }).notNull(),
});

export const quoteItems = pgTable("quote_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id),
  description: varchar("description", { length: 180 }).notNull(),
  qty: integer("qty").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  unitCost: numeric("unit_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
});

/* ─────────────────────────── Vendas (o coração do sistema) ─────────────────────────── */

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  salespersonId: integer("salesperson_id").references(() => salespeople.id),
  quoteId: integer("quote_id"),
  notes: text("notes").notNull().default(""),
  discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
  status: varchar("status", { length: 14 }).notNull().default("FECHADA"), // FECHADA | ENTREGUE | CANCELADA
  saleDate: varchar("sale_date", { length: 10 }).notNull(),
  totalValue: numeric("total_value", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  totalCost: numeric("total_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  commission: numeric("commission", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  profit: numeric("profit", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  margin: numeric("margin", { precision: 6, scale: 2 })
    .notNull()
    .default("0"),
  paymentSummary: varchar("payment_summary", { length: 140 }),
});

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  productId: integer("product_id"),
  description: varchar("description", { length: 180 }).notNull(),
  qty: integer("qty").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  unitCost: numeric("unit_cost", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
});

/* Custo flexível da venda: cada linha é um tipo de custo */
export const saleCosts = pgTable("sale_costs", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  type: varchar("type", { length: 20 }).notNull(), // PRODUCT | FREIGHT | INSTALLATION | COMMISSION | TAX | CARD_FEE | OTHER
  description: varchar("description", { length: 180 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
});

export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id")
    .notNull()
    .references(() => sales.id),
  salespersonId: integer("salesperson_id")
    .notNull()
    .references(() => salespeople.id),
  pct: numeric("pct", { precision: 5, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  month: varchar("month", { length: 7 }).notNull(), // 2026-05
  status: varchar("status", { length: 12 }).notNull().default("PENDENTE"), // PENDENTE | PAGA
});

/* ─────────────────────────── Financeiro ─────────────────────────── */

export const accountsReceivable = pgTable("accounts_receivable", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id"),
  customerId: integer("customer_id").references(() => customers.id),
  description: varchar("description", { length: 180 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 20 }).notNull().default("PIX"), // PIX | CARTAO | BOLETO | DINHEIRO
  dueDate: varchar("due_date", { length: 10 }).notNull(),
  paidAt: varchar("paid_at", { length: 10 }),
  status: varchar("status", { length: 12 }).notNull().default("PENDENTE"), // PENDENTE | RECEBIDO | VENCIDO
});

export const accountsPayable = pgTable("accounts_payable", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  description: varchar("description", { length: 180 }).notNull(),
  category: varchar("category", { length: 50 }).notNull().default("Operacional"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: varchar("due_date", { length: 10 }).notNull(),
  paidAt: varchar("paid_at", { length: 10 }),
  status: varchar("status", { length: 12 }).notNull().default("PENDENTE"), // PENDENTE | PAGO | VENCIDO
});

/* ─────────────────────────── Ordens de serviço / piscinas ─────────────────────────── */

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  saleId: integer("sale_id"),
  type: varchar("type", { length: 20 }).notNull(), // INSTALACAO | MANUTENCAO | LIMPEZA | REPARO
  technician: varchar("technician", { length: 90 }).notNull(),
  team: varchar("team", { length: 90 }),
  status: varchar("status", { length: 18 }).notNull().default("PENDENTE"),
  // PENDENTE | AGENDADA | DESLOCAMENTO | EXECUCAO | PAUSADA | CONCLUIDA | CANCELADA
  scheduledDate: varchar("scheduled_date", { length: 10 }).notNull(),
  timeSlot: varchar("time_slot", { length: 20 }).default("Manhã"),
  address: varchar("address", { length: 220 }),
  poolModel: varchar("pool_model", { length: 80 }),
  notes: text("notes"),
  createdAt: varchar("created_at", { length: 10 }).notNull(),
});

export const pools = pgTable("pools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 90 }).notNull(),
  sizeLabel: varchar("size_label", { length: 40 }).notNull(), // 7,0 x 3,0 x 1,40 m
  volumeLiters: integer("volume_liters").notNull(),
  material: varchar("material", { length: 60 }).notNull().default("Fibra"),
  equipment: varchar("equipment", { length: 220 }),
  warrantyMonths: integer("warranty_months").notNull().default(60),
  basePrice: numeric("base_price", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  active: boolean("active").notNull().default(true),
});
