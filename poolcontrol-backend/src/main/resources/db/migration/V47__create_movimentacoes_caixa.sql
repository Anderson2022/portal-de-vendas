CREATE TABLE public.movimentacoes_caixa (
    valor numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    ocorrido_em timestamp(6) with time zone NOT NULL,
    usuario_id bigint,
    caixa_id uuid NOT NULL,
    id uuid NOT NULL,
    movimentacao_financeira_id uuid,
    tipo character varying(20) NOT NULL,
    descricao character varying(255) NOT NULL
);

ALTER TABLE ONLY public.movimentacoes_caixa
    ADD CONSTRAINT movimentacoes_caixa_pkey PRIMARY KEY (id);
