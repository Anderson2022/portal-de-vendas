CREATE TABLE public.aprovacoes_financeiras (
    nivel integer NOT NULL,
    aprovado_por bigint,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    decidido_em timestamp(6) with time zone,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    solicitado_por bigint,
    documento_id uuid NOT NULL,
    id uuid NOT NULL,
    regra_id uuid,
    status character varying(20) NOT NULL,
    tipo_documento character varying(30) NOT NULL,
    observacoes text,
    CONSTRAINT aprovacoes_financeiras_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'APROVADO'::character varying, 'REPROVADO'::character varying, 'CANCELADO'::character varying])::text[])))
);

ALTER TABLE ONLY public.aprovacoes_financeiras
    ADD CONSTRAINT aprovacoes_financeiras_pkey PRIMARY KEY (id);
