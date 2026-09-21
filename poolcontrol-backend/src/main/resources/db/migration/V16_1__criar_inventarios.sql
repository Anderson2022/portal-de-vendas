CREATE TABLE inventarios (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    numero VARCHAR(30) NOT NULL,

    tipo VARCHAR(30) NOT NULL,
    deposito_id BIGINT NOT NULL REFERENCES depositos(id),
    status VARCHAR(30) NOT NULL DEFAULT 'RASCUNHO',

    inventario_cego BOOLEAN NOT NULL DEFAULT FALSE,
    dupla_contagem BOOLEAN NOT NULL DEFAULT FALSE,
    bloqueia_movimentacoes BOOLEAN NOT NULL DEFAULT TRUE,

    data_abertura TIMESTAMPTZ,
    data_contagem TIMESTAMPTZ,
    data_encerramento TIMESTAMPTZ,

    responsavel_id BIGINT NOT NULL REFERENCES users(id),

    observacao TEXT,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (empresa_id, numero),

    CHECK (
        tipo IN (
            'GERAL',
            'ROTATIVO',
            'PRODUTO',
            'LOCALIZACAO',
            'CATEGORIA',
            'LOTE'
        )
    ),

    CHECK (
        status IN (
            'RASCUNHO',
            'ABERTO',
            'EM_CONTAGEM',
            'AGUARDANDO_RECONTAGEM',
            'EM_ANALISE',
            'AGUARDANDO_APROVACAO',
            'CONCLUIDO',
            'CANCELADO'
        )
    )
);
