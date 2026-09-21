CREATE INDEX idx_inventarios_empresa_status
    ON inventarios (
        empresa_id,
        status
    );
