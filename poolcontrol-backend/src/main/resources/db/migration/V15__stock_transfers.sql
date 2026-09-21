CREATE TABLE localizacoes_estoque (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    deposito_id BIGINT NOT NULL REFERENCES depositos(id),

    codigo VARCHAR(60) NOT NULL,
    descricao VARCHAR(180),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (empresa_id, deposito_id, codigo)
);

CREATE TABLE transferencias_estoque (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    numero VARCHAR(30) NOT NULL,

    deposito_origem_id BIGINT NOT NULL REFERENCES depositos(id),
    deposito_destino_id BIGINT NOT NULL REFERENCES depositos(id),

    status VARCHAR(30) NOT NULL DEFAULT 'RASCUNHO',

    data_solicitacao TIMESTAMPTZ,
    data_saida TIMESTAMPTZ,
    data_recebimento TIMESTAMPTZ,

    solicitado_por BIGINT NOT NULL REFERENCES users(id),
    separado_por BIGINT REFERENCES users(id),
    expedido_por BIGINT REFERENCES users(id),
    recebido_por BIGINT REFERENCES users(id),

    motivo TEXT,
    observacao TEXT,
    codigo_integracao VARCHAR(100),

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (empresa_id, numero),

    CHECK (
        deposito_origem_id <> deposito_destino_id
    ),

    CHECK (
        status IN (
            'RASCUNHO',
            'SOLICITADA',
            'EM_SEPARACAO',
            'EM_TRANSITO',
            'RECEBIDA',
            'RECEBIDA_COM_DIVERGENCIA',
            'CANCELADA'
        )
    )
);

CREATE TABLE transferencia_itens (
    id BIGSERIAL PRIMARY KEY,

    transferencia_id BIGINT NOT NULL
        REFERENCES transferencias_estoque(id)
        ON DELETE CASCADE,

    produto_id BIGINT NOT NULL REFERENCES produtos(id),

    localizacao_origem_id BIGINT REFERENCES localizacoes_estoque(id),
    localizacao_destino_id BIGINT REFERENCES localizacoes_estoque(id),

    unidade_medida_id BIGINT NOT NULL REFERENCES unidades_medida(id),

    quantidade_solicitada NUMERIC(18,6) NOT NULL
        CHECK (quantidade_solicitada > 0),

    quantidade_separada NUMERIC(18,6),
    quantidade_enviada NUMERIC(18,6),
    quantidade_recebida NUMERIC(18,6),

    fator_conversao NUMERIC(18,6) NOT NULL
        CHECK (fator_conversao > 0),

    quantidade_base NUMERIC(18,6) NOT NULL
        CHECK (quantidade_base > 0),

    lote VARCHAR(100),
    validade DATE,
    numero_serie VARCHAR(160),

    observacao TEXT
);

CREATE TABLE transferencia_eventos (
    id BIGSERIAL PRIMARY KEY,

    transferencia_id BIGINT NOT NULL
        REFERENCES transferencias_estoque(id)
        ON DELETE CASCADE,

    status VARCHAR(30) NOT NULL,

    usuario_id BIGINT NOT NULL REFERENCES users(id),

    observacao TEXT,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transferencias_empresa_status
    ON transferencias_estoque (empresa_id, status);

CREATE INDEX idx_transferencia_itens_transferencia
    ON transferencia_itens (transferencia_id);