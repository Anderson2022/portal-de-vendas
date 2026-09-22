CREATE TABLE public.fechamentos_caixa (
    diferenca numeric(19,4) NOT NULL,
    saldo_informado numeric(19,4) NOT NULL,
    saldo_sistema numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fechado_em timestamp(6) with time zone NOT NULL,
    fechado_por bigint,
    caixa_id uuid NOT NULL,
    id uuid NOT NULL,
    observacoes text
);

ALTER TABLE ONLY public.fechamentos_caixa
    ADD CONSTRAINT fechamentos_caixa_pkey PRIMARY KEY (id);
