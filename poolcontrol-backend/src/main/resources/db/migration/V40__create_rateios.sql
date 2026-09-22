CREATE TABLE public.rateios (
    percentual numeric(9,4),
    valor numeric(19,4),
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_custo_id uuid,
    id uuid NOT NULL,
    origem_id uuid NOT NULL,
    plano_conta_id uuid,
    origem_tipo character varying(30) NOT NULL
);

ALTER TABLE ONLY public.rateios
    ADD CONSTRAINT rateios_pkey PRIMARY KEY (id);
