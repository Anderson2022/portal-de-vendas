--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aprovacoes_financeiras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aprovacoes_financeiras (
    nivel integer NOT NULL,
    aprovado_por bigint,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    decidido_em timestamp(6) with time zone,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    solicitado_por bigint,
    documento_id uuid NOT NULL,
    id uuid NOT NULL,
    regra_id uuid,
    status character varying(20) NOT NULL,
    tipo_documento character varying(30) NOT NULL,
    observacoes text,
    CONSTRAINT aprovacoes_financeiras_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'APROVADO'::character varying, 'REPROVADO'::character varying, 'CANCELADO'::character varying])::text[])))
);


--
-- Name: auditoria_financeira; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auditoria_financeira (
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    usuario_id bigint,
    entidade_id uuid NOT NULL,
    id uuid NOT NULL,
    acao character varying(30) NOT NULL,
    ip_origem character varying(64),
    entidade character varying(80) NOT NULL,
    dados_anteriores jsonb,
    dados_novos jsonb
);


--
-- Name: orcamento_itens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orcamento_itens (
    mes integer NOT NULL,
    valor_previsto numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_custo_id uuid,
    id uuid NOT NULL,
    orcamento_id uuid NOT NULL,
    plano_conta_id uuid
);


--
-- Name: orcamentos_financeiros; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orcamentos_financeiros (
    ano integer NOT NULL,
    mes_fim integer NOT NULL,
    mes_inicio integer NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    status character varying(20) NOT NULL,
    nome character varying(150) NOT NULL,
    observacoes text,
    CONSTRAINT orcamentos_financeiros_status_check CHECK (((status)::text = ANY ((ARRAY['RASCUNHO'::character varying, 'ATIVO'::character varying, 'ENCERRADO'::character varying, 'CANCELADO'::character varying])::text[])))
);


--
-- Name: regras_aprovacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regras_aprovacao (
    ativo boolean NOT NULL,
    nivel integer NOT NULL,
    valor_maximo numeric(19,4),
    valor_minimo numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    tipo_documento character varying(30) NOT NULL,
    papel_aprovador character varying(60) NOT NULL,
    nome character varying(150) NOT NULL
);


--
-- Name: aprovacoes_financeiras aprovacoes_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aprovacoes_financeiras
    ADD CONSTRAINT aprovacoes_financeiras_pkey PRIMARY KEY (id);


--
-- Name: auditoria_financeira auditoria_financeira_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria_financeira
    ADD CONSTRAINT auditoria_financeira_pkey PRIMARY KEY (id);


--
-- Name: orcamento_itens orcamento_itens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamento_itens
    ADD CONSTRAINT orcamento_itens_pkey PRIMARY KEY (id);


--
-- Name: orcamentos_financeiros orcamentos_financeiros_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orcamentos_financeiros
    ADD CONSTRAINT orcamentos_financeiros_pkey PRIMARY KEY (id);


--
-- Name: regras_aprovacao regras_aprovacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regras_aprovacao
    ADD CONSTRAINT regras_aprovacao_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


