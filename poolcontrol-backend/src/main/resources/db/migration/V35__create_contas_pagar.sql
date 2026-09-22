CREATE TABLE public.contas_pagar (
    data_competencia date NOT NULL,
    data_emissao date NOT NULL,
    data_vencimento date NOT NULL,
    desconto numeric(19,4) NOT NULL,
    juros numeric(19,4) NOT NULL,
    multa numeric(19,4) NOT NULL,
    recorrente boolean NOT NULL,
    valor_aberto numeric(19,4) NOT NULL,
    valor_original numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    compra_id bigint,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fornecedor_id bigint,
    categoria_financeira_id uuid,
    centro_custo_id uuid,
    id uuid NOT NULL,
    plano_conta_id uuid,
    status character varying(20) NOT NULL,
    numero_documento character varying(80),
    descricao character varying(255) NOT NULL,
    observacoes text,
    CONSTRAINT contas_pagar_status_check CHECK (((status)::text = ANY ((ARRAY['ABERTO'::character varying, 'PARCIAL'::character varying, 'PAGO'::character varying, 'VENCIDO'::character varying, 'CANCELADO'::character varying, 'ESTORNADO'::character varying])::text[])))
);

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_pkey PRIMARY KEY (id);
