CREATE TABLE unidades_medida (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(120) NOT NULL, code VARCHAR(20) NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, code));
CREATE TABLE tipos_produto (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(120) NOT NULL, code VARCHAR(40), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));
CREATE TABLE depositos (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(120) NOT NULL, code VARCHAR(40), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));
CREATE TABLE fabricantes (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(160) NOT NULL, code VARCHAR(60), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));
CREATE TABLE modelos_produto (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(160) NOT NULL, code VARCHAR(60), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));
CREATE TABLE materiais (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(120) NOT NULL, code VARCHAR(40), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));
CREATE TABLE acabamentos (id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), name VARCHAR(120) NOT NULL, code VARCHAR(40), active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, UNIQUE(empresa_id, name));

ALTER TABLE produtos
    ALTER COLUMN brand_id TYPE BIGINT USING NULLIF(brand_id, '')::BIGINT,
    ALTER COLUMN supplier_id TYPE BIGINT USING NULLIF(supplier_id, '')::BIGINT,
    ALTER COLUMN default_warehouse_id TYPE BIGINT USING NULLIF(default_warehouse_id, '')::BIGINT,
    ADD COLUMN product_type_id BIGINT REFERENCES tipos_produto(id),
    ADD COLUMN unit_id BIGINT REFERENCES unidades_medida(id),
    ADD COLUMN tax_unit_id BIGINT REFERENCES unidades_medida(id),
    ADD COLUMN purchase_unit_id BIGINT REFERENCES unidades_medida(id),
    ADD COLUMN manufacturer_id BIGINT REFERENCES fabricantes(id),
    ADD COLUMN model_id BIGINT REFERENCES modelos_produto(id),
    ADD COLUMN material_id BIGINT REFERENCES materiais(id),
    ADD COLUMN finish_id BIGINT REFERENCES acabamentos(id),
    ADD CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES marcas(id),
    ADD CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES fornecedores(id),
    ADD CONSTRAINT fk_products_warehouse FOREIGN KEY (default_warehouse_id) REFERENCES depositos(id);

INSERT INTO unidades_medida (empresa_id, name, code, created_at, updated_at)
SELECT c.id, u.name, u.code, now(), now() FROM empresas c CROSS JOIN (VALUES ('Unidade','UN'),('Quilograma','KG'),('Grama','G'),('Litro','L'),('Mililitro','ML'),('Metro','M'),('Metro quadrado','M2'),('Caixa','CX'),('Pacote','PCT')) u(name,code) ON CONFLICT DO NOTHING;
INSERT INTO tipos_produto (empresa_id, name, code, created_at, updated_at)
SELECT c.id, t.name, t.code, now(), now() FROM empresas c CROSS JOIN (VALUES ('Produto comum','STANDARD'),('Piscina','POOL'),('Motor','MOTOR'),('Filtro','FILTER'),('Produto químico','CHEMICAL'),('Acessório','ACCESSORY'),('Kit','KIT')) t(name,code) ON CONFLICT DO NOTHING;
