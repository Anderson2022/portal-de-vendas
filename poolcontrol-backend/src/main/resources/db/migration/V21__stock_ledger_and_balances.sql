CREATE TABLE lotes_estoque (
 id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL REFERENCES produtos(id),
 codigo VARCHAR(100) NOT NULL, validade DATE, ativo BOOLEAN NOT NULL DEFAULT TRUE, criado_em TIMESTAMPTZ NOT NULL DEFAULT now(), atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (empresa_id,produto_id,codigo)
);
CREATE TABLE estoques_saldos (
 id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), produto_id BIGINT NOT NULL REFERENCES produtos(id), deposito_id BIGINT REFERENCES depositos(id), localizacao_id BIGINT REFERENCES localizacoes_estoque(id), lote_id BIGINT REFERENCES lotes_estoque(id),
 quantidade_fisica NUMERIC(18,6) NOT NULL DEFAULT 0, quantidade_reservada NUMERIC(18,6) NOT NULL DEFAULT 0, quantidade_bloqueada NUMERIC(18,6) NOT NULL DEFAULT 0, quantidade_em_transito NUMERIC(18,6) NOT NULL DEFAULT 0, quantidade_terceiros NUMERIC(18,6) NOT NULL DEFAULT 0, quantidade_em_poder_terceiros NUMERIC(18,6) NOT NULL DEFAULT 0, atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE NULLS NOT DISTINCT (empresa_id,produto_id,deposito_id,localizacao_id,lote_id), CHECK (quantidade_reservada>=0 AND quantidade_bloqueada>=0 AND quantidade_em_transito>=0)
);
ALTER TABLE stock_movements ADD COLUMN location_id BIGINT REFERENCES localizacoes_estoque(id), ADD COLUMN lote_id BIGINT REFERENCES lotes_estoque(id), ADD COLUMN unit_id BIGINT REFERENCES unidades_medida(id), ADD COLUMN quantidade_informada NUMERIC(18,6), ADD COLUMN fator_conversao NUMERIC(18,6) NOT NULL DEFAULT 1, ADD COLUMN saldo_anterior NUMERIC(18,6), ADD COLUMN saldo_posterior NUMERIC(18,6), ADD COLUMN numero_serie VARCHAR(160), ADD COLUMN identificador_transacao UUID NOT NULL DEFAULT gen_random_uuid();
INSERT INTO estoques_saldos(empresa_id,produto_id,deposito_id,quantidade_fisica,quantidade_reservada)
SELECT empresa_id,product_id,warehouse_id,coalesce(sum(quantity) FILTER (WHERE type IN ('ENTRY','EXIT','RETURN','ADJUSTMENT')),0),coalesce(sum(quantity) FILTER (WHERE type IN ('RESERVATION','RELEASE')),0) FROM stock_movements GROUP BY empresa_id,product_id,warehouse_id ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION atualizar_saldo_movimentacao() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE saldo estoques_saldos%ROWTYPE; delta_fisico NUMERIC(18,6):=0; delta_reservado NUMERIC(18,6):=0;
BEGIN
 INSERT INTO estoques_saldos(empresa_id,produto_id,deposito_id,localizacao_id,lote_id) VALUES(NEW.empresa_id,NEW.product_id,NEW.warehouse_id,NEW.location_id,NEW.lote_id) ON CONFLICT DO NOTHING;
 SELECT * INTO saldo FROM estoques_saldos WHERE empresa_id=NEW.empresa_id AND produto_id=NEW.product_id AND deposito_id IS NOT DISTINCT FROM NEW.warehouse_id AND localizacao_id IS NOT DISTINCT FROM NEW.location_id AND lote_id IS NOT DISTINCT FROM NEW.lote_id FOR UPDATE;
 IF NEW.type IN ('ENTRY','EXIT','RETURN','ADJUSTMENT') THEN delta_fisico:=NEW.quantity; END IF;
 IF NEW.type IN ('RESERVATION','RELEASE') THEN delta_reservado:=NEW.quantity; END IF;
 IF saldo.quantidade_fisica+delta_fisico<0 OR saldo.quantidade_reservada+delta_reservado<0 OR saldo.quantidade_fisica+delta_fisico-saldo.quantidade_reservada-delta_reservado-saldo.quantidade_bloqueada<0 THEN RAISE EXCEPTION 'Saldo disponível insuficiente para a movimentação'; END IF;
 NEW.quantidade_informada:=coalesce(NEW.quantidade_informada,abs(NEW.quantity)); NEW.saldo_anterior:=saldo.quantidade_fisica; NEW.saldo_posterior:=saldo.quantidade_fisica+delta_fisico;
 UPDATE estoques_saldos SET quantidade_fisica=quantidade_fisica+delta_fisico,quantidade_reservada=quantidade_reservada+delta_reservado,atualizado_em=now() WHERE id=saldo.id; RETURN NEW;
END $$;
CREATE TRIGGER trg_atualizar_saldo_movimentacao BEFORE INSERT ON stock_movements FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_movimentacao();
CREATE INDEX idx_saldos_produto_deposito ON estoques_saldos(empresa_id,produto_id,deposito_id);
CREATE INDEX idx_movimentos_transacao ON stock_movements(identificador_transacao);
