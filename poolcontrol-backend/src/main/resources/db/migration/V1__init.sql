CREATE TABLE empresas (
    id BIGSERIAL PRIMARY KEY,
    legal_name VARCHAR(160) NOT NULL,
    trade_name VARCHAR(160) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(160),
    phone VARCHAR(30),
    logo_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    name VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_roles_company_name UNIQUE (empresa_id, name)
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    PRIMARY KEY (role_id, permission)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    name VARCHAR(140) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE salespeople (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(160) NOT NULL,
    email VARCHAR(180),
    phone VARCHAR(30),
    default_commission_rate NUMERIC(7,4) NOT NULL,
    monthly_target NUMERIC(14,2) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    name VARCHAR(160) NOT NULL,
    document_number VARCHAR(20),
    phone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(180),
    address VARCHAR(220),
    city VARCHAR(120),
    state VARCHAR(2),
    source VARCHAR(80),
    salesperson_id BIGINT REFERENCES salespeople(id),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE fornecedores (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    name VARCHAR(160) NOT NULL,
    document_number VARCHAR(20),
    phone VARCHAR(30),
    email VARCHAR(180),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE categorias_produto (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_product_category_company_name UNIQUE (empresa_id, name)
);

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    sku VARCHAR(60),
    barcode VARCHAR(60),
    name VARCHAR(180) NOT NULL,
    description VARCHAR(1000),
    category_id BIGINT REFERENCES categorias_produto(id),
    cost_price NUMERIC(14,2) NOT NULL,
    sale_price NUMERIC(14,2) NOT NULL,
    minimum_stock NUMERIC(14,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    product_id BIGINT NOT NULL REFERENCES produtos(id),
    warehouse_id BIGINT,
    type VARCHAR(20) NOT NULL,
    quantity NUMERIC(14,3) NOT NULL,
    unit_cost NUMERIC(14,2) NOT NULL,
    total_cost NUMERIC(14,2) NOT NULL,
    reference_type VARCHAR(40),
    reference_id BIGINT,
    created_by BIGINT NOT NULL REFERENCES users(id),
    notes VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE quotes (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    salesperson_id BIGINT REFERENCES salespeople(id),
    status VARCHAR(20) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL,
    discount NUMERIC(14,2) NOT NULL,
    total NUMERIC(14,2) NOT NULL,
    valid_until DATE,
    notes VARCHAR(1200),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE quote_items (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    quote_id BIGINT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES produtos(id),
    description VARCHAR(220) NOT NULL,
    quantity NUMERIC(14,3) NOT NULL,
    unit_price NUMERIC(14,2) NOT NULL,
    total_price NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    salesperson_id BIGINT REFERENCES salespeople(id),
    status VARCHAR(20) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL,
    discount NUMERIC(14,2) NOT NULL,
    total_sale NUMERIC(14,2) NOT NULL,
    product_cost NUMERIC(14,2) NOT NULL,
    additional_cost NUMERIC(14,2) NOT NULL,
    commission_rate NUMERIC(8,4) NOT NULL,
    commission_amount NUMERIC(14,2) NOT NULL,
    total_cost NUMERIC(14,2) NOT NULL,
    profit NUMERIC(14,2) NOT NULL,
    margin_percent NUMERIC(8,4) NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sale_items (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES produtos(id),
    description VARCHAR(220) NOT NULL,
    quantity NUMERIC(14,3) NOT NULL,
    unit_price NUMERIC(14,2) NOT NULL,
    unit_cost NUMERIC(14,2) NOT NULL,
    total_price NUMERIC(14,2) NOT NULL,
    total_cost NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sale_costs (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL,
    description VARCHAR(220) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE sale_payments (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    amount NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_method VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE commissions (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    sale_id BIGINT NOT NULL REFERENCES sales(id),
    salesperson_id BIGINT NOT NULL REFERENCES salespeople(id),
    base_amount NUMERIC(14,2) NOT NULL,
    rate NUMERIC(8,4) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uk_commission_sale UNIQUE (empresa_id, sale_id)
);

CREATE TABLE accounts_receivable (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    customer_id BIGINT REFERENCES customers(id),
    source_type VARCHAR(40) NOT NULL,
    source_id BIGINT,
    description VARCHAR(220) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(40),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE accounts_payable (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    supplier_id BIGINT REFERENCES fornecedores(id),
    description VARCHAR(220) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE customer_pools (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    model VARCHAR(160) NOT NULL,
    length_m NUMERIC(10,2),
    width_m NUMERIC(10,2),
    depth_m NUMERIC(10,2),
    volume_liters NUMERIC(14,2),
    motor VARCHAR(160),
    filter_model VARCHAR(160),
    warranty_until DATE,
    notes VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE work_orders (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    pool_id BIGINT REFERENCES customer_pools(id),
    assigned_user_id BIGINT REFERENCES users(id),
    type VARCHAR(80) NOT NULL,
    status VARCHAR(20) NOT NULL,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    description VARCHAR(1500),
    labor_cost NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE work_order_materials (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES produtos(id),
    quantity NUMERIC(14,3) NOT NULL,
    unit_cost NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    user_id BIGINT REFERENCES users(id),
    module VARCHAR(60) NOT NULL,
    action VARCHAR(60) NOT NULL,
    entity_type VARCHAR(80),
    entity_id BIGINT,
    details VARCHAR(1500),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_customers_company ON customers(empresa_id);
CREATE INDEX idx_products_company ON produtos(empresa_id);
CREATE INDEX idx_stock_company_product ON stock_movements(empresa_id, product_id);
CREATE INDEX idx_quotes_company_status ON quotes(empresa_id, status);
CREATE INDEX idx_sales_company_status ON sales(empresa_id, status);
CREATE INDEX idx_sales_company_salesperson ON sales(empresa_id, salesperson_id);
CREATE INDEX idx_receivable_company_status ON accounts_receivable(empresa_id, status);
CREATE INDEX idx_payable_company_status ON accounts_payable(empresa_id, status);
CREATE INDEX idx_work_order_company_status ON work_orders(empresa_id, status);
CREATE INDEX idx_audit_company_created ON audit_logs(empresa_id, created_at DESC);
