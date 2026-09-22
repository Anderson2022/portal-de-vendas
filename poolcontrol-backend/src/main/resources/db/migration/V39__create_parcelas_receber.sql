CREATE TABLE public.parcelas_receber (
    data_vencimento date NOT NULL,
    desconto numeric(19,4) NOT NULL,
    juros numeric(19,4) NOT NULL,
    multa numeric(19,4) NOT NULL,
    parcela integer NOT NULL,
    total_parcelas integer NOT NULL,
    valor_aberto numeric(19,4) NOT NULL,
    valor_original numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    conta_receber_id uuid NOT NULL,
    id uuid NOT NULL,
    status character varying(20) NOT NULL,
    CONSTRAINT parcelas_receber_status_check CHECK (((status)::text = ANY ((ARRAY['ABERTA'::character varying, 'PARCIAL'::character varying, 'PAGA'::character varying, 'VENCIDA'::character varying, 'CANCELADA'::character varying, 'ESTORNADA'::character varying])::text[])))
);

ALTER TABLE ONLY public.parcelas_receber
    ADD CONSTRAINT parcelas_receber_pkey PRIMARY KEY (id);
