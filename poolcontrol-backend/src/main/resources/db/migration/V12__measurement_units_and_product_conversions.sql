ALTER TABLE unidades_medida
ADD COLUMN IF NOT EXISTS sigla VARCHAR(10),
ADD COLUMN IF NOT EXISTS tipo VARCHAR(30) NOT NULL DEFAULT 'OUTRO',
ADD COLUMN IF NOT EXISTS casas_decimais INTEGER NOT NULL DEFAULT 0;

UPDATE unidades_medida
SET
    sigla = code
WHERE
    sigla IS NULL;

ALTER TABLE unidades_medida
ALTER COLUMN sigla
SET
    NOT NULL;

ALTER TABLE unidades_medida ADD CONSTRAINT ck_unidade_medida_casas_decimais CHECK (casas_decimais BETWEEN 0 AND 6);

ALTER TABLE unidades_medida ADD CONSTRAINT ck_unidade_medida_tipo CHECK (
    tipo IN (
        'UNIDADE',
        'PESO',
        'VOLUME',
        'COMPRIMENTO',
        'AREA',
        'EMBALAGEM',
        'OUTRO'
    )
);

CREATE TABLE produto_unidades_medida (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produtos (id),
    unidade_medida_id BIGINT NOT NULL REFERENCES unidades_medida (id),
    fator_conversao NUMERIC(18, 6) NOT NULL DEFAULT 1 CHECK (fator_conversao > 0),
    unidade_base BOOLEAN NOT NULL DEFAULT FALSE,
    permite_compra BOOLEAN NOT NULL DEFAULT TRUE,
    permite_venda BOOLEAN NOT NULL DEFAULT TRUE,
    permite_estoque BOOLEAN NOT NULL DEFAULT TRUE,
    codigo_barras VARCHAR(50),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now (),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now (),
    CONSTRAINT uk_produto_unidade UNIQUE (produto_id, unidade_medida_id),
    CONSTRAINT ck_produto_unidade_base_fator CHECK (
        NOT unidade_base
        OR fator_conversao = 1
    )
);

CREATE UNIQUE INDEX uk_produto_unidade_base ON produto_unidades_medida (produto_id)
WHERE
    unidade_base
    AND ativo;

CREATE INDEX idx_produto_unidade_produto ON produto_unidades_medida (produto_id);

CREATE INDEX idx_produto_unidade_unidade ON produto_unidades_medida (unidade_medida_id);

CREATE INDEX idx_produto_unidade_codigo_barras ON produto_unidades_medida (codigo_barras);
