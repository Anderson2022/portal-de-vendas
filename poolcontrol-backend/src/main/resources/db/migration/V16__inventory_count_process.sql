CREATE TABLE inventarios (
 id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), numero VARCHAR(30) NOT NULL,
 tipo VARCHAR(30) NOT NULL, deposito_id BIGINT NOT NULL REFERENCES depositos(id), status VARCHAR(30) NOT NULL DEFAULT 'RASCUNHO',
 inventario_cego BOOLEAN NOT NULL DEFAULT FALSE, dupla_contagem BOOLEAN NOT NULL DEFAULT FALSE, bloqueia_movimentacoes BOOLEAN NOT NULL DEFAULT TRUE,
 data_abertura TIMESTAMPTZ, data_contagem TIMESTAMPTZ, data_encerramento TIMESTAMPTZ, responsavel_id BIGINT NOT NULL REFERENCES users(id),
 observacao TEXT, criado_em TIMESTAMPTZ NOT NULL DEFAULT now(), atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(empresa_id,numero),
 CHECK(tipo IN ('GERAL','ROTATIVO','PRODUTO','LOCALIZACAO','CATEGORIA','LOTE')),
 CHECK(status IN ('RASCUNHO','ABERTO','EM_CONTAGEM','AGUARDANDO_RECONTAGEM','EM_ANALISE','AGUARDANDO_APROVACAO','CONCLUIDO','CANCELADO'))
);
CREATE TABLE inventario_itens (
 id BIGSERIAL PRIMARY KEY, inventario_id BIGINT NOT NULL REFERENCES inventarios(id) ON DELETE CASCADE, produto_id BIGINT NOT NULL REFERENCES produtos(id),
 deposito_id BIGINT NOT NULL REFERENCES depositos(id), localizacao_id BIGINT REFERENCES localizacoes_estoque(id), lote VARCHAR(100), numero_serie VARCHAR(160),
 unidade_medida_id BIGINT REFERENCES unidades_medida(id), saldo_sistema NUMERIC(18,6) NOT NULL, quantidade_aprovada NUMERIC(18,6), divergencia NUMERIC(18,6),
 status_item VARCHAR(30) NOT NULL DEFAULT 'PENDENTE', motivo_divergencia VARCHAR(180), observacao TEXT, UNIQUE(inventario_id,produto_id,localizacao_id,lote,numero_serie)
);
CREATE TABLE inventario_contagens (
 id BIGSERIAL PRIMARY KEY, inventario_item_id BIGINT NOT NULL REFERENCES inventario_itens(id) ON DELETE CASCADE,
 numero_contagem INTEGER NOT NULL, quantidade NUMERIC(18,6) NOT NULL CHECK(quantidade>=0), usuario_id BIGINT NOT NULL REFERENCES users(id), data_hora TIMESTAMPTZ NOT NULL DEFAULT now(), observacao TEXT,
 UNIQUE(inventario_item_id,numero_contagem)
);
CREATE TABLE inventario_eventos (
 id BIGSERIAL PRIMARY KEY, inventario_id BIGINT NOT NULL REFERENCES inventarios(id) ON DELETE CASCADE,
 status VARCHAR(30) NOT NULL, usuario_id BIGINT NOT NULL REFERENCES users(id), descricao TEXT, criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inventarios_empresa_status ON inventarios(empresa_id,status);
CREATE INDEX idx_inventario_itens_inventario ON inventario_itens(inventario_id);
