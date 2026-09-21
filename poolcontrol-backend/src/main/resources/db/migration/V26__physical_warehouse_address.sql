CREATE TABLE predios (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    deposito_id BIGINT NOT NULL REFERENCES depositos(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, deposito_id, codigo)
);

CREATE TABLE ruas (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    predio_id BIGINT NOT NULL REFERENCES predios(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, predio_id, codigo)
);

CREATE TABLE estantes (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    rua_id BIGINT NOT NULL REFERENCES ruas(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, rua_id, codigo)
);

CREATE TABLE vaos (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    estante_id BIGINT NOT NULL REFERENCES estantes(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, estante_id, codigo)
);

CREATE TABLE niveis (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    vao_id BIGINT NOT NULL REFERENCES vaos(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    capacidade NUMERIC(14,3),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, vao_id, codigo)
);

CREATE TABLE posicoes (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    nivel_id BIGINT NOT NULL REFERENCES niveis(id),

    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(120) NOT NULL,
    capacidade NUMERIC(14,3),

    permite_armazenagem BOOLEAN NOT NULL DEFAULT TRUE,
    permite_picking BOOLEAN NOT NULL DEFAULT FALSE,
    bloqueada BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    UNIQUE (empresa_id, nivel_id, codigo)
);

ALTER TABLE produtos
    ADD COLUMN default_position_id BIGINT REFERENCES posicoes(id);

ALTER TABLE estoques_saldos
    ADD COLUMN posicao_id BIGINT REFERENCES posicoes(id);

CREATE INDEX idx_estoques_saldos_posicao
    ON estoques_saldos (
        empresa_id,
        produto_id,
        posicao_id
    );