-- Migration V6_16__sincronizar_produtos_existentes.sql
-- Parte da V6: normalizacao dos detalhes de produto.

UPDATE produtos SET details_json=details_json;
