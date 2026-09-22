CREATE TABLE public.formas_pagamento (
    ativo boolean NOT NULL,
    dias_compensacao integer NOT NULL,
    taxa_fixa numeric(19,4) NOT NULL,
    taxa_percentual numeric(9,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    codigo character varying(30) NOT NULL,
    tipo character varying(30) NOT NULL,
    nome character varying(120) NOT NULL,
    CONSTRAINT formas_pagamento_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['BOLETO'::character varying, 'PIX'::character varying, 'DINHEIRO'::character varying, 'CARTAO'::character varying, 'TRANSFERENCIA'::character varying, 'CHEQUE'::character varying, 'DEPOSITO'::character varying, 'OUTRO'::character varying])::text[])))
);

ALTER TABLE ONLY public.formas_pagamento
    ADD CONSTRAINT formas_pagamento_pkey PRIMARY KEY (id);
