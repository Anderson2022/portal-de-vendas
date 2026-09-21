ALTER TABLE produtos ADD COLUMN default_location_id BIGINT REFERENCES localizacoes_estoque(id);
