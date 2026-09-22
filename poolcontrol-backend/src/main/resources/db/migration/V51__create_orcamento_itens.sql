CREATE TABLE public.orcamento_itens (
    mes integer NOT NULL,
    valor_previsto numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_custo_id uuid,
    id uuid NOT NULL,
    orcamento_id uuid NOT NULL,
    plano_conta_id uuid
);

ALTER TABLE ONLY public.orcamento_itens
    ADD CONSTRAINT orcamento_itens_pkey PRIMARY KEY (id);
