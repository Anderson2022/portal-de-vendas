ALTER TABLE produtos
    ADD COLUMN IF NOT EXISTS brand_id VARCHAR(80),
    ADD COLUMN IF NOT EXISTS supplier_id VARCHAR(80),
    ADD COLUMN IF NOT EXISTS default_warehouse_id VARCHAR(80),
    ADD COLUMN IF NOT EXISTS details_json TEXT;

CREATE INDEX IF NOT EXISTS idx_products_brand_id ON produtos (brand_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON produtos (supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_default_warehouse_id ON produtos (default_warehouse_id);
