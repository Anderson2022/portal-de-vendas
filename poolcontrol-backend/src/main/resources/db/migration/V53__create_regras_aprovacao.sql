CREATE TABLE public.regras_aprovacao (
    ativo boolean NOT NULL,
    nivel integer NOT NULL,
    valor_maximo numeric(19,4),
    valor_minimo numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    tipo_documento character varying(30) NOT NULL,
    papel_aprovador character varying(60) NOT NULL,
    nome character varying(150) NOT NULL
);

ALTER TABLE ONLY public.regras_aprovacao
    ADD CONSTRAINT regras_aprovacao_pkey PRIMARY KEY (id);
