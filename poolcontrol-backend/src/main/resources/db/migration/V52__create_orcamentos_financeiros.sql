CREATE TABLE public.orcamentos_financeiros (
    ano integer NOT NULL,
    mes_fim integer NOT NULL,
    mes_inicio integer NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    status character varying(20) NOT NULL,
    nome character varying(150) NOT NULL,
    observacoes text,
    CONSTRAINT orcamentos_financeiros_status_check CHECK (((status)::text = ANY ((ARRAY['RASCUNHO'::character varying, 'ATIVO'::character varying, 'ENCERRADO'::character varying, 'CANCELADO'::character varying])::text[])))
);

ALTER TABLE ONLY public.orcamentos_financeiros
    ADD CONSTRAINT orcamentos_financeiros_pkey PRIMARY KEY (id);
