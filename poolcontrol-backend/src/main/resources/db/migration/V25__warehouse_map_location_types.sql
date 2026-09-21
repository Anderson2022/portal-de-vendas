ALTER TABLE localizacoes_estoque
DROP CONSTRAINT IF EXISTS ck_localizacao_tipo;

ALTER TABLE localizacoes_estoque ADD CONSTRAINT ck_localizacao_tipo CHECK (
    tipo IN (
        'AREA',
        'CORREDOR',
        'PRATELEIRA',
        'LINHA',
        'COLUNA',
        'RUA',
        'ESTANTE',
        'VAO',
        'NIVEL',
        'POSICAO'
    )
);
