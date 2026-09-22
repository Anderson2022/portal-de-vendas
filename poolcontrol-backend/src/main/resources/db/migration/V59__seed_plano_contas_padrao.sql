-- PLANO DE CONTAS PADRÃO - POSTGRESQL
-- Empresa padrão: empresa_id = 1
-- Ajuste nomes de tabelas/colunas se o seu schema for diferente.
--
-- Tabelas esperadas:
-- tipos_conta_contabil(id, codigo, nome, ativo)
-- naturezas_contabeis(id, codigo, nome, ativo)
-- grupos_contabeis(id, empresa_id, codigo, nome, ativo)
-- subgrupos_contabeis(id, empresa_id, grupo_id, codigo, nome, ativo)
-- plano_contas(id, empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
--              tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
--              aceita_lancamento, ativo, permite_centro_custo, exige_historico,
--              criado_em, atualizado_em)



-- 1. TIPOS DE CONTA
INSERT INTO tipos_conta_contabil (codigo, nome, ativo) VALUES
('SINTETICA', 'Sintética', TRUE),
('ANALITICA', 'Analítica', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- 2. NATUREZAS
INSERT INTO naturezas_contabeis (codigo, nome, ativo) VALUES
('DEV', 'Devedora', TRUE),
('CRED', 'Credora', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- 3. GRUPOS CONTÁBEIS
INSERT INTO grupos_contabeis (empresa_id, codigo, nome, ativo) VALUES
(1, 'ATIVO', 'Ativo', TRUE),
(1, 'PASSIVO', 'Passivo', TRUE),
(1, 'PL', 'Patrimônio Líquido', TRUE),
(1, 'RECEITA', 'Receitas', TRUE),
(1, 'CUSTO', 'Custos', TRUE),
(1, 'DESPESA', 'Despesas', TRUE),
(1, 'RESULTADO', 'Resultado', TRUE),
(1, 'COMPENSACAO', 'Contas de Compensação', TRUE)
ON CONFLICT (empresa_id, codigo) DO NOTHING;

-- 4. SUBGRUPOS CONTÁBEIS
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'ATIVO_CIRC', 'Ativo Circulante', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'ATIVO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'ATIVO_CIRC'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'ATIVO_NCIRC', 'Ativo Não Circulante', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'ATIVO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'ATIVO_NCIRC'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'PASSIVO_CIRC', 'Passivo Circulante', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'PASSIVO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'PASSIVO_CIRC'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'PASSIVO_NCIRC', 'Passivo Não Circulante', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'PASSIVO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'PASSIVO_NCIRC'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'PL', 'Patrimônio Líquido', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'PL'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'PL'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'REC_OPER_BRUTA', 'Receita Operacional Bruta', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'RECEITA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'REC_OPER_BRUTA'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DEDUCOES_RECEITA', 'Deduções da Receita', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'RECEITA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DEDUCOES_RECEITA'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'OUTRAS_RECEITAS', 'Outras Receitas Operacionais', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'RECEITA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'OUTRAS_RECEITAS'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'REC_FIN', 'Receitas Financeiras', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'RECEITA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'REC_FIN'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'CMV', 'Custo das Mercadorias Vendidas', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'CUSTO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'CMV'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'CPV', 'Custo dos Produtos Vendidos', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'CUSTO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'CPV'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'CSP', 'Custo dos Serviços Prestados', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'CUSTO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'CSP'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_COM', 'Despesas Comerciais', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_COM'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_ADM', 'Despesas Administrativas', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_ADM'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_PESSOAL', 'Despesas com Pessoal', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_PESSOAL'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_OCUP', 'Despesas de Ocupação', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_OCUP'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_TI', 'Despesas de Tecnologia', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_TI'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_FIN', 'Despesas Financeiras', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_FIN'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'DESP_TRIB', 'Despesas Tributárias', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'DESP_TRIB'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'OUTRAS_DESP', 'Outras Despesas Operacionais', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'DESPESA'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'OUTRAS_DESP'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'RESULTADO_EX', 'Resultado do Exercício', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'RESULTADO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'RESULTADO_EX'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'COMP_ATIVA', 'Compensação Ativa', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'COMPENSACAO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'COMP_ATIVA'
);
INSERT INTO subgrupos_contabeis (empresa_id, grupo_id, codigo, nome, ativo)
SELECT 1, g.id, 'COMP_PASSIVA', 'Compensação Passiva', TRUE
FROM grupos_contabeis g
WHERE g.empresa_id = 1 AND g.codigo = 'COMPENSACAO'
AND NOT EXISTS (
    SELECT 1 FROM subgrupos_contabeis s
    WHERE s.empresa_id = 1 AND s.codigo = 'COMP_PASSIVA'
);

-- 5. PLANO DE CONTAS
-- Sintéticas não aceitam lançamento; analíticas aceitam.
-- Centro de custo habilitado nas contas analíticas de receita/custo/despesa/resultado.

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1',
    '0001',
    'ATIVO',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1',
    '0002',
    'ATIVO CIRCULANTE',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1',
    '0003',
    'Disponibilidades',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.01',
    '0004',
    'Caixa',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.01'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.01.001',
    '0005',
    'Caixa Geral',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.01.002',
    '0006',
    'Caixa Filial',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.02',
    '0007',
    'Bancos Conta Movimento',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.02'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.02.001',
    '0008',
    'Bancos - Conta Corrente',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.02.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.02.002',
    '0009',
    'Bancos - Conta Poupança',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.02.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.03',
    '0010',
    'Aplicações Financeiras',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.03'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.1.03.001',
    '0011',
    'Aplicações de Liquidez Imediata',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.1.03'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.1.03.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2',
    '0012',
    'Créditos a Receber',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.01',
    '0013',
    'Clientes',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.01'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.01.001',
    '0014',
    'Duplicatas a Receber',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.01.002',
    '0015',
    'Cartões a Receber',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.01.003',
    '0016',
    'Boletos a Receber',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.02',
    '0017',
    'Outros Créditos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.02'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.02.001',
    '0018',
    'Adiantamentos a Funcionários',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.02.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.2.02.002',
    '0019',
    'Adiantamentos a Fornecedores',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.2.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.2.02.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3',
    '0020',
    'Estoques',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.01',
    '0021',
    'Mercadorias para Revenda',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.01'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.01.001',
    '0022',
    'Estoque de Mercadorias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3.01'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.02',
    '0023',
    'Produtos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.02'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.02.001',
    '0024',
    'Produtos Acabados',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.02.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.02.002',
    '0025',
    'Produtos em Elaboração',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3.02'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.02.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.03',
    '0026',
    'Materiais',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3'),
    4,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.03'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.03.001',
    '0027',
    'Matérias-Primas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3.03'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.03.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.3.03.002',
    '0028',
    'Materiais de Uso e Consumo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.3.03'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.3.03.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4',
    '0029',
    'Tributos a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4.01.001',
    '0030',
    'ICMS a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4.01.002',
    '0031',
    'IPI a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4.01.003',
    '0032',
    'PIS a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4.01.004',
    '0033',
    'COFINS a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.4.01.005',
    '0034',
    'IRRF a Recuperar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.4.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.5',
    '0035',
    'Despesas Antecipadas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.5'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.5.01.001',
    '0036',
    'Seguros a Apropriar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.5.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.1.5.01.002',
    '0037',
    'Assinaturas e Licenças a Apropriar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.1.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.1.5.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2',
    '0038',
    'ATIVO NÃO CIRCULANTE',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.1',
    '0039',
    'Realizável a Longo Prazo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.1.01.001',
    '0040',
    'Clientes - Longo Prazo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.1.01.002',
    '0041',
    'Depósitos Judiciais',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.2',
    '0042',
    'Investimentos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.2.01.001',
    '0043',
    'Participações Societárias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.2.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3',
    '0044',
    'Imobilizado',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.001',
    '0045',
    'Terrenos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.002',
    '0046',
    'Edificações',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.003',
    '0047',
    'Máquinas e Equipamentos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.004',
    '0048',
    'Móveis e Utensílios',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.005',
    '0049',
    'Veículos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.01.006',
    '0050',
    'Equipamentos de Informática',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.3.02.001',
    '0051',
    'Depreciação Acumulada',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.3.02.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.4',
    '0052',
    'Intangível',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.4.01.001',
    '0053',
    'Softwares e Licenças',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.4.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '1.2.4.02.001',
    '0054',
    'Amortização Acumulada',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '1.2.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'ATIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '1.2.4.02.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2',
    '0055',
    'PASSIVO',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1',
    '0056',
    'PASSIVO CIRCULANTE',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.1',
    '0057',
    'Fornecedores',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.1.01.001',
    '0058',
    'Fornecedores Nacionais',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.1.01.002',
    '0059',
    'Fornecedores Estrangeiros',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2',
    '0060',
    'Obrigações Trabalhistas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2.01.001',
    '0061',
    'Salários a Pagar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2.01.002',
    '0062',
    'Férias a Pagar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2.01.003',
    '0063',
    '13º Salário a Pagar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2.01.004',
    '0064',
    'INSS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.2.01.005',
    '0065',
    'FGTS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.2.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3',
    '0066',
    'Obrigações Tributárias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.001',
    '0067',
    'ICMS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.002',
    '0068',
    'ISS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.003',
    '0069',
    'PIS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.004',
    '0070',
    'COFINS a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.005',
    '0071',
    'IRPJ a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.3.01.006',
    '0072',
    'CSLL a Recolher',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.3.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.4',
    '0073',
    'Empréstimos e Financiamentos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.4.01.001',
    '0074',
    'Empréstimos Bancários - Curto Prazo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.4.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.5',
    '0075',
    'Outras Obrigações',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.5'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.5.01.001',
    '0076',
    'Adiantamentos de Clientes',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.5.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.5.01.002',
    '0077',
    'Aluguéis a Pagar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.5.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.1.5.01.003',
    '0078',
    'Energia Elétrica a Pagar',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.1.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_CIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.1.5.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.2',
    '0079',
    'PASSIVO NÃO CIRCULANTE',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.2.1',
    '0080',
    'Empréstimos e Financiamentos - Longo Prazo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.2.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.2.1.01.001',
    '0081',
    'Financiamentos Bancários - Longo Prazo',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.2.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.2.2',
    '0082',
    'Parcelamentos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.2'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_NCIRC'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.2.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.2.2.01.001',
    '0083',
    'Parcelamentos Tributários',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.2.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PASSIVO_NCIRC'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.2.2.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3',
    '0084',
    'PATRIMÔNIO LÍQUIDO',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.1',
    '0085',
    'Capital Social',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.1.01.001',
    '0086',
    'Capital Social Integralizado',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.2',
    '0087',
    'Reservas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.2.01.001',
    '0088',
    'Reserva Legal',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.2.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.2.01.002',
    '0089',
    'Reservas de Lucros',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.2.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.3',
    '0090',
    'Resultados Acumulados',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.3.01.001',
    '0091',
    'Lucros Acumulados',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.3.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '2.3.3.01.002',
    '0092',
    'Prejuízos Acumulados',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '2.3.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'PL'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '2.3.3.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3',
    '0093',
    'RECEITAS',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.1',
    '0094',
    'RECEITA OPERACIONAL BRUTA',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_OPER_BRUTA'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.1.1',
    '0095',
    'Receitas de Vendas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.1'),
    3,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_OPER_BRUTA'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.1.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.1.1.01.001',
    '0096',
    'Venda de Mercadorias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.1.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_OPER_BRUTA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.1.1.01.002',
    '0097',
    'Venda de Produtos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.1.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_OPER_BRUTA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.1.1.01.003',
    '0098',
    'Prestação de Serviços',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.1.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_OPER_BRUTA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.1.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2',
    '0099',
    'DEDUÇÕES DA RECEITA',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.001',
    '0100',
    'Devoluções de Vendas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.002',
    '0101',
    'Descontos Incondicionais',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.003',
    '0102',
    'ICMS sobre Vendas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.004',
    '0103',
    'ISS sobre Serviços',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.005',
    '0104',
    'PIS sobre Faturamento',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.2.1.01.006',
    '0105',
    'COFINS sobre Faturamento',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DEDUCOES_RECEITA'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.2.1.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.3',
    '0106',
    'OUTRAS RECEITAS OPERACIONAIS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_RECEITAS'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.3.1.01.001',
    '0107',
    'Receitas com Aluguéis',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_RECEITAS'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.3.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.3.1.01.002',
    '0108',
    'Recuperação de Despesas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_RECEITAS'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.3.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.4',
    '0109',
    'RECEITAS FINANCEIRAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_FIN'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.4.1.01.001',
    '0110',
    'Juros Ativos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.4.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.4.1.01.002',
    '0111',
    'Rendimentos de Aplicações',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.4.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '3.4.1.01.003',
    '0112',
    'Descontos Obtidos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '3.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RECEITA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'REC_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '3.4.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4',
    '0113',
    'CUSTOS',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.1',
    '0114',
    'CUSTO DAS MERCADORIAS VENDIDAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CMV'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.1.1.01.001',
    '0115',
    'Custo das Mercadorias Vendidas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CMV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.1.1.01.002',
    '0116',
    'Fretes sobre Compras',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CMV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.1.1.01.003',
    '0117',
    'Perdas de Estoque',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CMV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.1.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.2',
    '0118',
    'CUSTO DOS PRODUTOS VENDIDOS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CPV'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.2.1.01.001',
    '0119',
    'Matéria-Prima Consumida',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CPV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.2.1.01.002',
    '0120',
    'Mão de Obra Direta',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CPV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.2.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.2.1.01.003',
    '0121',
    'Custos Indiretos de Fabricação',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CPV'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.2.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.3',
    '0122',
    'CUSTO DOS SERVIÇOS PRESTADOS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CSP'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.3.1.01.001',
    '0123',
    'Mão de Obra de Serviços',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CSP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.3.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '4.3.1.01.002',
    '0124',
    'Materiais Aplicados em Serviços',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '4.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'CUSTO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'CSP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '4.3.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5',
    '0125',
    'DESPESAS OPERACIONAIS',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.1',
    '0126',
    'DESPESAS COMERCIAIS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_COM'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.1.1.01.001',
    '0127',
    'Comissões sobre Vendas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_COM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.1.1.01.002',
    '0128',
    'Publicidade e Propaganda',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_COM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.1.1.01.003',
    '0129',
    'Fretes sobre Vendas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_COM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.1.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.1.1.01.004',
    '0130',
    'Brindes e Promoções',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_COM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.1.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2',
    '0131',
    'DESPESAS ADMINISTRATIVAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2.1.01.001',
    '0132',
    'Material de Escritório',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2.1.01.002',
    '0133',
    'Serviços Contábeis',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2.1.01.003',
    '0134',
    'Serviços Jurídicos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2.1.01.004',
    '0135',
    'Consultorias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.2.1.01.005',
    '0136',
    'Correios e Cartórios',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_ADM'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.2.1.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3',
    '0137',
    'DESPESAS COM PESSOAL',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.001',
    '0138',
    'Salários',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.002',
    '0139',
    'Pró-Labore',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.003',
    '0140',
    'Horas Extras',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.004',
    '0141',
    'Férias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.005',
    '0142',
    '13º Salário',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.006',
    '0143',
    'INSS Patronal',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.007',
    '0144',
    'FGTS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.007'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.008',
    '0145',
    'Vale Transporte',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.008'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.009',
    '0146',
    'Vale Alimentação / Refeição',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.009'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.3.1.01.010',
    '0147',
    'Plano de Saúde',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.3'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_PESSOAL'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.3.1.01.010'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4',
    '0148',
    'DESPESAS DE OCUPAÇÃO',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.001',
    '0149',
    'Aluguéis',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.002',
    '0150',
    'Condomínio',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.003',
    '0151',
    'Energia Elétrica',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.004',
    '0152',
    'Água e Esgoto',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.005',
    '0153',
    'Manutenção Predial',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.006',
    '0154',
    'Limpeza e Conservação',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.4.1.01.007',
    '0155',
    'Segurança',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.4'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_OCUP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.4.1.01.007'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.5',
    '0156',
    'DESPESAS DE TECNOLOGIA',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TI'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.5'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.5.1.01.001',
    '0157',
    'Internet e Telefonia',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TI'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.5.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.5.1.01.002',
    '0158',
    'Softwares e Sistemas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TI'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.5.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.5.1.01.003',
    '0159',
    'Hospedagem e Cloud',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TI'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.5.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.5.1.01.004',
    '0160',
    'Manutenção de Equipamentos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.5'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TI'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.5.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.6',
    '0161',
    'DESPESAS FINANCEIRAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_FIN'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.6'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.6.1.01.001',
    '0162',
    'Juros Passivos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.6'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.6.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.6.1.01.002',
    '0163',
    'Tarifas Bancárias',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.6'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.6.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.6.1.01.003',
    '0164',
    'IOF',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.6'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.6.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.6.1.01.004',
    '0165',
    'Descontos Concedidos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.6'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_FIN'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.6.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.7',
    '0166',
    'DESPESAS TRIBUTÁRIAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TRIB'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.7'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.7.1.01.001',
    '0167',
    'Taxas e Licenças',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.7'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TRIB'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.7.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.7.1.01.002',
    '0168',
    'IPTU',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.7'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TRIB'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.7.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.7.1.01.003',
    '0169',
    'IPVA',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.7'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TRIB'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.7.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.7.1.01.004',
    '0170',
    'Multas Fiscais',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.7'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESP_TRIB'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.7.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8',
    '0171',
    'OUTRAS DESPESAS OPERACIONAIS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.001',
    '0172',
    'Viagens e Hospedagens',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.002',
    '0173',
    'Combustíveis',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.003',
    '0174',
    'Manutenção de Veículos',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.004',
    '0175',
    'Seguros',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.005',
    '0176',
    'Depreciações',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.005'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '5.8.1.01.006',
    '0177',
    'Amortizações',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '5.8'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'DESPESA'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'OUTRAS_DESP'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '5.8.1.01.006'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6',
    '0178',
    'RESULTADO',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6.1',
    '0179',
    'RESULTADO DO EXERCÍCIO',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '6'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO_EX'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6.1.1.01.001',
    '0180',
    'Resultado Antes do IRPJ e CSLL',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '6.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO_EX'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6.1.1.01.002',
    '0181',
    'Provisão para IRPJ',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '6.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO_EX'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6.1.1.01.003',
    '0182',
    'Provisão para CSLL',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '6.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO_EX'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6.1.1.01.003'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '6.1.1.01.004',
    '0183',
    'Lucro / Prejuízo Líquido do Exercício',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '6.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'RESULTADO_EX'),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '6.1.1.01.004'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7',
    '0184',
    'CONTAS DE COMPENSAÇÃO',
    NULL,
    1,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    NULL,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.1',
    '0185',
    'CONTAS DE COMPENSAÇÃO ATIVAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_ATIVA'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.1'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.1.1.01.001',
    '0186',
    'Bens de Terceiros em Poder da Empresa',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_ATIVA'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.1.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.1.1.01.002',
    '0187',
    'Contratos e Garantias Recebidas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7.1'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'DEV'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_ATIVA'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.1.1.01.002'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.2',
    '0188',
    'CONTAS DE COMPENSAÇÃO PASSIVAS',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7'),
    2,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'SINTETICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_PASSIVA'),
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.2'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.2.1.01.001',
    '0189',
    'Bens da Empresa em Poder de Terceiros',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_PASSIVA'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.2.1.01.001'
);

INSERT INTO plano_contas (
    empresa_id, codigo, codigo_reduzido, nome, conta_pai_id, nivel,
    tipo_conta_id, natureza_id, grupo_id, subgrupo_id,
    aceita_lancamento, ativo, permite_centro_custo, exige_historico,
    criado_em, atualizado_em
)
SELECT
    1,
    '7.2.1.01.002',
    '0190',
    'Contratos e Garantias Concedidas',
    (SELECT id FROM plano_contas WHERE empresa_id = 1 AND codigo = '7.2'),
    5,
    (SELECT id FROM tipos_conta_contabil WHERE codigo = 'ANALITICA'),
    (SELECT id FROM naturezas_contabeis WHERE codigo = 'CRED'),
    (SELECT id FROM grupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMPENSACAO'),
    (SELECT id FROM subgrupos_contabeis WHERE empresa_id = 1 AND codigo = 'COMP_PASSIVA'),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM plano_contas
    WHERE empresa_id = 1
      AND codigo = '7.2.1.01.002'
);



-- CONFERÊNCIA
SELECT codigo, codigo_reduzido, nome, nivel FROM plano_contas WHERE empresa_id = 1 ORDER BY codigo;
UPDATE plano_contas p
SET sintetica = (t.codigo = 'SINTETICA'),
    natureza = CASE WHEN n.codigo = 'CRED' THEN 'CREDORA' ELSE 'DEVEDORA' END
FROM tipos_conta_contabil t, naturezas_contabeis n
WHERE p.tipo_conta_id = t.id
  AND p.natureza_id = n.id
  AND p.empresa_id = 1;
