CREATE TABLE public.auditoria_financeira (
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    usuario_id bigint,
    entidade_id uuid NOT NULL,
    id uuid NOT NULL,
    acao character varying(30) NOT NULL,
    ip_origem character varying(64),
    entidade character varying(80) NOT NULL,
    dados_anteriores jsonb,
    dados_novos jsonb
);

ALTER TABLE ONLY public.auditoria_financeira
    ADD CONSTRAINT auditoria_financeira_pkey PRIMARY KEY (id);
