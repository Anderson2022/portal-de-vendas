CREATE TABLE unidades_estoque (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas (id),
    codigo VARCHAR(40) NOT NULL,
    nome VARCHAR(140) NOT NULL,
    cidade VARCHAR(100),
    uf CHAR(2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now (),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now (),
    UNIQUE (empresa_id, codigo)
);

ALTER TABLE depositos
ADD COLUMN unidade_estoque_id BIGINT REFERENCES unidades_estoque (id);

ALTER TABLE localizacoes_estoque
ADD COLUMN localizacao_pai_id BIGINT REFERENCES localizacoes_estoque (id),
ADD COLUMN tipo VARCHAR(30) NOT NULL DEFAULT 'POSICAO',
ADD COLUMN corredor VARCHAR(30),
ADD COLUMN prateleira VARCHAR(30),
ADD COLUMN linha VARCHAR(30),
ADD COLUMN coluna VARCHAR(30),
ADD COLUMN posicao VARCHAR(30),
ADD CONSTRAINT ck_localizacao_tipo CHECK (
    tipo IN (
        'AREA',
        'CORREDOR',
        'PRATELEIRA',
        'LINHA',
        'COLUNA',
        'POSICAO'
    )
);

CREATE INDEX idx_depositos_unidade_estoque ON depositos (unidade_estoque_id);

CREATE INDEX idx_localizacoes_pai ON localizacoes_estoque (localizacao_pai_id);
