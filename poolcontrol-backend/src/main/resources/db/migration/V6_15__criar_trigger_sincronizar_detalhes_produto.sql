-- Migration V6_15__criar_trigger_sincronizar_detalhes_produto.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE TRIGGER trg_sincronizar_detalhes_produto AFTER INSERT OR UPDATE OF details_json ON produtos
FOR EACH ROW EXECUTE FUNCTION sincronizar_detalhes_produto();
