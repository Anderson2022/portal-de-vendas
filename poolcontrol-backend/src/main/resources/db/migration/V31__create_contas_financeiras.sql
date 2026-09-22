CREATE TABLE public.contas_financeiras (
    ativo boolean NOT NULL,
    moeda character varying(3) NOT NULL,
    saldo_atual numeric(19,4) NOT NULL,
    saldo_inicial numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    tipo character varying(20) NOT NULL,
    codigo character varying(40) NOT NULL,
    nome character varying(150) NOT NULL,
    CONSTRAINT contas_financeiras_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['BANCO'::character varying, 'CAIXA'::character varying, 'CARTEIRA'::character varying, 'APLICACAO'::character varying, 'OUTRA'::character varying])::text[])))
);

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_pkey PRIMARY KEY (id);
