ALTER TABLE plano_contas
    ADD COLUMN natureza_financeira_padrao_id UUID REFERENCES naturezas_financeiras(id);
