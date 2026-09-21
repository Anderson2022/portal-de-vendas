-- Migration V6_13__inserir_tensoes_padrao.sql
-- Parte da V6: normalizacao dos detalhes de produto.

INSERT INTO tensoes_produto (empresa_id, nome, codigo)
SELECT id, t.nome, t.codigo FROM empresas CROSS JOIN (VALUES ('127 V','127'),('220 V','220'),('Bivolt','BIVOLT')) t(nome,codigo)
ON CONFLICT DO NOTHING;
