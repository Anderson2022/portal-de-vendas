CREATE TABLE public.categorias_financeiras (
    ativo boolean NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    tipo_fluxo character varying(15) NOT NULL,
    categoria_pai_id uuid,
    id uuid NOT NULL,
    codigo character varying(30) NOT NULL,
    nome character varying(150) NOT NULL,
    descricao text
);

ALTER TABLE ONLY public.categorias_financeiras
    ADD CONSTRAINT categorias_financeiras_pkey PRIMARY KEY (id);
