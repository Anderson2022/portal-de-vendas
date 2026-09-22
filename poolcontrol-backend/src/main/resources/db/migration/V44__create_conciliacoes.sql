CREATE TABLE public.conciliacoes (
    diferenca numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    conciliado_em timestamp(6) with time zone,
    conciliado_por bigint,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    extrato_id uuid NOT NULL,
    id uuid NOT NULL,
    movimentacao_financeira_id uuid,
    status character varying(20) NOT NULL,
    observacoes text,
    CONSTRAINT conciliacoes_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'CONCILIADO'::character varying, 'DIVERGENTE'::character varying, 'IGNORADO'::character varying])::text[])))
);

ALTER TABLE ONLY public.conciliacoes
    ADD CONSTRAINT conciliacoes_pkey PRIMARY KEY (id);
