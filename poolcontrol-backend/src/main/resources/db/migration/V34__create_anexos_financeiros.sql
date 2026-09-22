CREATE TABLE public.anexos_financeiros (
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    criado_por bigint,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    tamanho_bytes bigint,
    entidade_id uuid NOT NULL,
    id uuid NOT NULL,
    entidade character varying(50) NOT NULL,
    mime_type character varying(120),
    nome_arquivo character varying(255) NOT NULL,
    url text NOT NULL
);

ALTER TABLE ONLY public.anexos_financeiros
    ADD CONSTRAINT anexos_financeiros_pkey PRIMARY KEY (id);
