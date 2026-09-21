INSERT INTO estoques_saldos (
    empresa_id,
    produto_id,
    deposito_id,
    quantidade_fisica,
    quantidade_reservada
)
SELECT
    empresa_id,
    product_id,
    warehouse_id,
    COALESCE(
        SUM(quantity) FILTER (
            WHERE type IN ('ENTRY', 'EXIT', 'RETURN', 'ADJUSTMENT')
        ),
        0
    ),
    COALESCE(
        SUM(quantity) FILTER (
            WHERE type IN ('RESERVATION', 'RELEASE')
        ),
        0
    )
FROM stock_movements
GROUP BY
    empresa_id,
    product_id,
    warehouse_id
ON CONFLICT DO NOTHING;
