ALTER TABLE marcas
ADD COLUMN IF NOT EXISTS codigo VARCHAR(30),
ADD COLUMN IF NOT EXISTS nome_reduzido VARCHAR(80),
ADD COLUMN IF NOT EXISTS codigo_externo VARCHAR(100),
ADD COLUMN IF NOT EXISTS excluido_em TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS fabricante_id BIGINT REFERENCES fabricantes (id),
ADD COLUMN IF NOT EXISTS logo_url TEXT;

CREATE INDEX IF NOT EXISTS idx_marcas_empresa_fabricante ON marcas (empresa_id, fabricante_id);

CREATE INDEX IF NOT EXISTS idx_marcas_nome ON marcas (nome);

CREATE INDEX IF NOT EXISTS idx_marcas_empresa ON marcas (empresa_id);

CREATE INDEX IF NOT EXISTS idx_marcas_ativo ON marcas (ativo);

CREATE INDEX IF NOT EXISTS idx_marcas_codigo_externo ON marcas (codigo_externo);

CREATE UNIQUE INDEX IF NOT EXISTS uk_marcas_empresa_codigo ON marcas (empresa_id, codigo)
WHERE
    codigo IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_marcas_empresa_nome ON marcas (empresa_id, LOWER(nome));
