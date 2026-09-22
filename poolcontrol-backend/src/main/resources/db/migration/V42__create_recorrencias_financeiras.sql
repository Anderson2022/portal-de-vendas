CREATE TABLE public.recorrencias_financeiras (
    ativo boolean NOT NULL,
    dia_vencimento integer NOT NULL,
    fim date,
    inicio date NOT NULL,
    proxima_geracao date,
    valor numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    pessoa_id bigint,
    categoria_financeira_id uuid,
    centro_custo_id uuid,
    id uuid NOT NULL,
    plano_conta_id uuid,
    periodicidade character varying(20) NOT NULL,
    tipo character varying(20) NOT NULL,
    descricao character varying(255) NOT NULL
);

ALTER TABLE ONLY public.recorrencias_financeiras
    ADD CONSTRAINT recorrencias_financeiras_pkey PRIMARY KEY (id);
