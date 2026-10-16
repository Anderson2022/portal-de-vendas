ALTER TABLE accounts_payable
    ADD COLUMN competence_date DATE;

CREATE INDEX idx_payable_competence
    ON accounts_payable (empresa_id, competence_date, centro_custo_id);
