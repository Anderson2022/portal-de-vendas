CREATE TABLE public.movimentacoes_financeiras (
    conciliado boolean NOT NULL,
    data_movimento date NOT NULL,
    valor numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    categoria_financeira_id uuid,
    centro_custo_id uuid,
    conta_destino_id uuid,
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    origem_id uuid,
    tipo character varying(20) NOT NULL,
    origem character varying(30) NOT NULL,
    descricao character varying(255) NOT NULL,
    CONSTRAINT movimentacoes_financeiras_origem_check CHECK (((origem)::text = ANY ((ARRAY['MANUAL'::character varying, 'VENDA'::character varying, 'COMPRA'::character varying, 'PAGAMENTO'::character varying, 'RECEBIMENTO'::character varying, 'ESTORNO'::character varying, 'TARIFA'::character varying, 'JUROS'::character varying, 'TRANSFERENCIA'::character varying, 'CONCILIACAO'::character varying])::text[]))),
    CONSTRAINT movimentacoes_financeiras_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying, 'TRANSFERENCIA'::character varying])::text[])))
);

ALTER TABLE ONLY public.movimentacoes_financeiras
    ADD CONSTRAINT movimentacoes_financeiras_pkey PRIMARY KEY (id);
