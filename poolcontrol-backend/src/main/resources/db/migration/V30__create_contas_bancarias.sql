CREATE TABLE public.contas_bancarias (
    digito_conta character varying(5),
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    codigo_banco character varying(10),
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    pix character varying(18),
    agencia character varying(20),
    titular_documento character varying(20),
    conta character varying(30),
    tipo_conta character varying(30),
    banco character varying(150),
    titular_nome character varying(180)
);

ALTER TABLE ONLY public.contas_bancarias
    ADD CONSTRAINT contas_bancarias_pkey PRIMARY KEY (id);
