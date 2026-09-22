CREATE TABLE public.plano_contas (
    ativo boolean NOT NULL,
    sintetica boolean NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    conta_pai_id uuid,
    id uuid NOT NULL,
    natureza character varying(20) NOT NULL,
    tipo_dre character varying(30),
    codigo character varying(40) NOT NULL,
    nome character varying(180) NOT NULL
);

ALTER TABLE ONLY public.plano_contas
    ADD CONSTRAINT plano_contas_pkey PRIMARY KEY (id);
