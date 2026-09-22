CREATE TABLE public.caixas (
    aberto boolean NOT NULL,
    saldo_abertura numeric(19,4),
    saldo_fechamento numeric(19,4),
    aberto_em timestamp(6) with time zone,
    aberto_por bigint,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fechado_em timestamp(6) with time zone,
    fechado_por bigint,
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    nome character varying(120) NOT NULL
);

ALTER TABLE ONLY public.caixas
    ADD CONSTRAINT caixas_pkey PRIMARY KEY (id);
