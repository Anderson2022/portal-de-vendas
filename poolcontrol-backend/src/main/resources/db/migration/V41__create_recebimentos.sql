CREATE TABLE public.recebimentos (
    data_recebimento date NOT NULL,
    desconto numeric(19,4) NOT NULL,
    juros numeric(19,4) NOT NULL,
    multa numeric(19,4) NOT NULL,
    valor_principal numeric(19,4) NOT NULL,
    valor_total numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    estornado_em timestamp(6) with time zone,
    excluido_em timestamp(6) with time zone,
    conta_financeira_id uuid NOT NULL,
    conta_receber_id uuid NOT NULL,
    estornado_por uuid,
    forma_pagamento_id uuid,
    id uuid NOT NULL,
    parcela_receber_id uuid,
    motivo_estorno character varying(255)
);

ALTER TABLE ONLY public.recebimentos
    ADD CONSTRAINT recebimentos_pkey PRIMARY KEY (id);
