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
-- Name: caixas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.caixas (
    aberto boolean NOT NULL,
    saldo_abertura numeric(19,4),
    saldo_fechamento numeric(19,4),
    aberto_em timestamp(6) with time zone,
    aberto_por bigint,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fechado_em timestamp(6) with time zone,
    fechado_por bigint,
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    nome character varying(120) NOT NULL
);


--
-- Name: conciliacoes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conciliacoes (
    diferenca numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    conciliado_em timestamp(6) with time zone,
    conciliado_por bigint,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    extrato_id uuid NOT NULL,
    id uuid NOT NULL,
    movimentacao_financeira_id uuid,
    status character varying(20) NOT NULL,
    observacoes text,
    CONSTRAINT conciliacoes_status_check CHECK (((status)::text = ANY ((ARRAY['PENDENTE'::character varying, 'CONCILIADO'::character varying, 'DIVERGENTE'::character varying, 'IGNORADO'::character varying])::text[])))
);


--
-- Name: extratos_bancarios; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: fechamentos_caixa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fechamentos_caixa (
    diferenca numeric(19,4) NOT NULL,
    saldo_informado numeric(19,4) NOT NULL,
    saldo_sistema numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fechado_em timestamp(6) with time zone NOT NULL,
    fechado_por bigint,
    caixa_id uuid NOT NULL,
    id uuid NOT NULL,
    observacoes text
);


--
-- Name: movimentacoes_caixa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimentacoes_caixa (
    valor numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    ocorrido_em timestamp(6) with time zone NOT NULL,
    usuario_id bigint,
    caixa_id uuid NOT NULL,
    id uuid NOT NULL,
    movimentacao_financeira_id uuid,
    tipo character varying(20) NOT NULL,
    descricao character varying(255) NOT NULL
);


--
-- Name: movimentacoes_financeiras; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: caixas caixas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.caixas
    ADD CONSTRAINT caixas_pkey PRIMARY KEY (id);


--
-- Name: conciliacoes conciliacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conciliacoes
    ADD CONSTRAINT conciliacoes_pkey PRIMARY KEY (id);


--
-- Name: extratos_bancarios extratos_bancarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extratos_bancarios
    ADD CONSTRAINT extratos_bancarios_pkey PRIMARY KEY (id);


--
-- Name: fechamentos_caixa fechamentos_caixa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fechamentos_caixa
    ADD CONSTRAINT fechamentos_caixa_pkey PRIMARY KEY (id);


--
-- Name: movimentacoes_caixa movimentacoes_caixa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes_caixa
    ADD CONSTRAINT movimentacoes_caixa_pkey PRIMARY KEY (id);


--
-- Name: movimentacoes_financeiras movimentacoes_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimentacoes_financeiras
    ADD CONSTRAINT movimentacoes_financeiras_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


