-- Migration V6_12__criar_indices_produto.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE INDEX idx_produto_variacoes_empresa_produto ON produto_variacoes_preco (empresa_id, produto_id);
CREATE INDEX idx_produto_componentes_empresa_produto ON produto_componentes_kit (empresa_id, produto_id);
