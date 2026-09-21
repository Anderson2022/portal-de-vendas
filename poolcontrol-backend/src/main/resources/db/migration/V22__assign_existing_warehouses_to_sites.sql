INSERT INTO unidades_estoque(empresa_id,codigo,nome,ativo)
SELECT e.id,'MATRIZ','Matriz',true FROM empresas e
WHERE NOT EXISTS(SELECT 1 FROM unidades_estoque u WHERE u.empresa_id=e.id);
UPDATE depositos d SET unidade_estoque_id=(SELECT u.id FROM unidades_estoque u WHERE u.empresa_id=d.empresa_id ORDER BY u.id LIMIT 1)
WHERE d.unidade_estoque_id IS NULL;
