ALTER TABLE transferencias_estoque
 ADD COLUMN criado_por_usuario_id BIGINT REFERENCES users(id),
 ADD COLUMN cancelado_por_usuario_id BIGINT REFERENCES users(id),
 ADD COLUMN separado_em TIMESTAMPTZ,
 ADD COLUMN expedido_em TIMESTAMPTZ,
 ADD COLUMN cancelado_em TIMESTAMPTZ;
UPDATE transferencias_estoque SET criado_por_usuario_id=solicitado_por WHERE criado_por_usuario_id IS NULL;
ALTER TABLE transferencias_estoque ALTER COLUMN criado_por_usuario_id SET NOT NULL;
ALTER TABLE transferencia_eventos
 ADD COLUMN evento VARCHAR(40), ADD COLUMN status_anterior VARCHAR(30), ADD COLUMN status_novo VARCHAR(30);
CREATE TABLE motivos_transferencia (
 id BIGSERIAL PRIMARY KEY, empresa_id BIGINT NOT NULL REFERENCES empresas(id), codigo VARCHAR(30) NOT NULL,
 nome VARCHAR(120) NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE, criado_em TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(empresa_id,codigo)
);
INSERT INTO motivos_transferencia(empresa_id,codigo,nome)
SELECT id,'REPOSICAO','Reposição de estoque' FROM empresas ON CONFLICT DO NOTHING;
INSERT INTO motivos_transferencia(empresa_id,codigo,nome)
SELECT id,'REMANEJAMENTO','Remanejamento interno' FROM empresas ON CONFLICT DO NOTHING;
INSERT INTO motivos_transferencia(empresa_id,codigo,nome)
SELECT id,'DEVOLUCAO','Devolução ao depósito' FROM empresas ON CONFLICT DO NOTHING;
