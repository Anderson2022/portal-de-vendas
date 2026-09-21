CREATE TRIGGER trg_atualizar_saldo_movimentacao
BEFORE INSERT
ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION atualizar_saldo_movimentacao();
