CREATE TABLE subgrupos_contabeis (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    grupo_id BIGINT NOT NULL REFERENCES grupos_contabeis(id),
    codigo VARCHAR(40) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_subgrupos_contabeis_empresa_codigo UNIQUE (empresa_id, codigo)
);
