CREATE OR REPLACE FUNCTION atualizar_saldo_movimentacao()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    saldo estoques_saldos%ROWTYPE;
    delta_fisico NUMERIC(18,6) := 0;
    delta_reservado NUMERIC(18,6) := 0;
BEGIN
    INSERT INTO estoques_saldos (
        empresa_id,
        produto_id,
        deposito_id,
        localizacao_id,
        lote_id
    )
    VALUES (
        NEW.empresa_id,
        NEW.product_id,
        NEW.warehouse_id,
        NEW.location_id,
        NEW.lote_id
    )
    ON CONFLICT DO NOTHING;

    SELECT *
    INTO saldo
    FROM estoques_saldos
    WHERE empresa_id = NEW.empresa_id
      AND produto_id = NEW.product_id
      AND deposito_id IS NOT DISTINCT FROM NEW.warehouse_id
      AND localizacao_id IS NOT DISTINCT FROM NEW.location_id
      AND lote_id IS NOT DISTINCT FROM NEW.lote_id
    FOR UPDATE;

    IF NEW.type IN ('ENTRY', 'EXIT', 'RETURN', 'ADJUSTMENT') THEN
        delta_fisico := NEW.quantity;
    END IF;

    IF NEW.type IN ('RESERVATION', 'RELEASE') THEN
        delta_reservado := NEW.quantity;
    END IF;

    IF saldo.quantidade_fisica + delta_fisico < 0
       OR saldo.quantidade_reservada + delta_reservado < 0
       OR (
            saldo.quantidade_fisica
            + delta_fisico
            - saldo.quantidade_reservada
            - delta_reservado
            - saldo.quantidade_bloqueada
       ) < 0
    THEN
        RAISE EXCEPTION 'Saldo disponível insuficiente para a movimentação';
    END IF;

    NEW.quantidade_informada := COALESCE(
        NEW.quantidade_informada,
        ABS(NEW.quantity)
    );

    NEW.saldo_anterior := saldo.quantidade_fisica;
    NEW.saldo_posterior := saldo.quantidade_fisica + delta_fisico;

    UPDATE estoques_saldos
    SET
        quantidade_fisica = quantidade_fisica + delta_fisico,
        quantidade_reservada = quantidade_reservada + delta_reservado,
        atualizado_em = now()
    WHERE id = saldo.id;

    RETURN NEW;
END;
$$;
