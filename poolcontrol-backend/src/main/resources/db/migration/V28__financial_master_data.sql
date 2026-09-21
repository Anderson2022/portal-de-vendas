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
-- Name: categorias_financeiras; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: centros_custos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.centros_custos (
    ativo boolean NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_pai_id uuid,
    id uuid NOT NULL,
    codigo character varying(30) NOT NULL,
    nome character varying(150) NOT NULL
);


--
-- Name: contas_bancarias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contas_bancarias (
    digito_conta character varying(5),
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    codigo_banco character varying(10),
    conta_financeira_id uuid NOT NULL,
    id uuid NOT NULL,
    pix character varying(18),
    agencia character varying(20),
    titular_documento character varying(20),
    conta character varying(30),
    tipo_conta character varying(30),
    banco character varying(150),
    titular_nome character varying(180)
);


--
-- Name: contas_financeiras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contas_financeiras (
    ativo boolean NOT NULL,
    moeda character varying(3) NOT NULL,
    saldo_atual numeric(19,4) NOT NULL,
    saldo_inicial numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    id uuid NOT NULL,
    tipo character varying(20) NOT NULL,
    codigo character varying(40) NOT NULL,
    nome character varying(150) NOT NULL,
    CONSTRAINT contas_financeiras_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['BANCO'::character varying, 'CAIXA'::character varying, 'CARTEIRA'::character varying, 'APLICACAO'::character varying, 'OUTRA'::character varying])::text[])))
);


--
-- Name: formas_pagamento; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: plano_contas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plano_contas (
    ativo boolean NOT NULL,
    sintetica boolean NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    conta_pai_id uuid,
    id uuid NOT NULL,
    natureza character varying(20) NOT NULL,
    tipo_dre character varying(30),
    codigo character varying(40) NOT NULL,
    nome character varying(180) NOT NULL
);


--
-- Name: categorias_financeiras categorias_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categorias_financeiras
    ADD CONSTRAINT categorias_financeiras_pkey PRIMARY KEY (id);


--
-- Name: centros_custos centros_custos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.centros_custos
    ADD CONSTRAINT centros_custos_pkey PRIMARY KEY (id);


--
-- Name: contas_bancarias contas_bancarias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contas_bancarias
    ADD CONSTRAINT contas_bancarias_pkey PRIMARY KEY (id);


--
-- Name: contas_financeiras contas_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contas_financeiras
    ADD CONSTRAINT contas_financeiras_pkey PRIMARY KEY (id);


--
-- Name: formas_pagamento formas_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.formas_pagamento
    ADD CONSTRAINT formas_pagamento_pkey PRIMARY KEY (id);


--
-- Name: plano_contas plano_contas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plano_contas
    ADD CONSTRAINT plano_contas_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


