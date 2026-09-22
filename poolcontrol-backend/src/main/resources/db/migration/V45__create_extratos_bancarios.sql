CREATE TABLE public.extratos_bancarios (
    data_lancamento date NOT NULL,
    valor numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    status character varying(20) NOT NULL,
    tipo character varying(20) NOT NULL,
    identificador_externo character varying(120),
    hash_importacao character varying(128),
    descricao character varying(255) NOT NULL,
    CONSTRAINT extratos_bancarios_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'CONCILIADO'::character varying, 'DIVERGENTE'::character varying, 'IGNORADO'::character varying])::text[]))),
    CONSTRAINT extratos_bancarios_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['ENTRADA'::character varying, 'SAIDA'::character varying, 'TRANSFERENCIA'::character varying])::text[])))
);

ALTER TABLE ONLY public.extratos_bancarios
    ADD CONSTRAINT extratos_bancarios_pkey PRIMARY KEY (id);
