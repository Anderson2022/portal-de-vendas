CREATE TABLE grupos_contabeis (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    codigo VARCHAR(30) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_grupos_contabeis_empresa_codigo UNIQUE (empresa_id, codigo)
);
