CREATE TABLE public.centros_custos (
    ativo boolean NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_pai_id uuid,
    id uuid NOT NULL,
    codigo character varying(30) NOT NULL,
    nome character varying(150) NOT NULL
);

ALTER TABLE ONLY public.centros_custos
    ADD CONSTRAINT centros_custos_pkey PRIMARY KEY (id);
