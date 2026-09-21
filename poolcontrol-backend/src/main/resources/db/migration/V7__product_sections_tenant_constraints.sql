ALTER TABLE produtos ADD CONSTRAINT uk_produtos_id_empresa UNIQUE (id, empresa_id);

ALTER TABLE tensoes_produto ADD CONSTRAINT uk_tensoes_id_empresa UNIQUE (id, empresa_id);

ALTER TABLE produto_identificacao ADD CONSTRAINT fk_identificacao_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_precos ADD CONSTRAINT fk_precos_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_estoque_configuracao ADD CONSTRAINT fk_estoque_config_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_fiscal ADD CONSTRAINT fk_fiscal_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_tecnico ADD CONSTRAINT fk_tecnico_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_logistica ADD CONSTRAINT fk_logistica_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_midia ADD CONSTRAINT fk_midia_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_especificacoes ADD CONSTRAINT fk_especificacoes_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_variacoes_preco ADD CONSTRAINT fk_variacoes_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_componentes_kit ADD CONSTRAINT fk_componentes_produto_empresa FOREIGN KEY (produto_id, empresa_id) REFERENCES produtos (id, empresa_id) ON DELETE CASCADE;

ALTER TABLE produto_especificacoes ADD CONSTRAINT fk_especificacoes_tensao_empresa FOREIGN KEY (tensao_id, empresa_id) REFERENCES tensoes_produto (id, empresa_id);
