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
-- Name: anexos_financeiros; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: contas_pagar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contas_pagar (
    data_competencia date NOT NULL,
    data_emissao date NOT NULL,
    data_vencimento date NOT NULL,
    desconto numeric(19,4) NOT NULL,
    juros numeric(19,4) NOT NULL,
    multa numeric(19,4) NOT NULL,
    recorrente boolean NOT NULL,
    valor_aberto numeric(19,4) NOT NULL,
    valor_original numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    compra_id bigint,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    fornecedor_id bigint,
    categoria_financeira_id uuid,
    centro_custo_id uuid,
    id uuid NOT NULL,
    plano_conta_id uuid,
    status character varying(20) NOT NULL,
    numero_documento character varying(80),
    descricao character varying(255) NOT NULL,
    observacoes text,
    CONSTRAINT contas_pagar_status_check CHECK (((status)::text = ANY ((ARRAY['ABERTO'::character varying, 'PARCIAL'::character varying, 'PAGO'::character varying, 'VENCIDO'::character varying, 'CANCELADO'::character varying, 'ESTORNADO'::character varying])::text[])))
);


--
-- Name: contas_receber; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contas_receber (
    data_competencia date NOT NULL,
    data_emissao date NOT NULL,
    data_vencimento date NOT NULL,
    desconto numeric(19,4) NOT NULL,
    juros numeric(19,4) NOT NULL,
    multa numeric(19,4) NOT NULL,
    recorrente boolean NOT NULL,
    valor_aberto numeric(19,4) NOT NULL,
    valor_original numeric(19,4) NOT NULL,
    atualizado_em timestamp(6) with time zone NOT NULL,
    cliente_id bigint,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    venda_id bigint,
    categoria_financeira_id uuid,
    centro_custo_id uuid,
    id uuid NOT NULL,
    plano_conta_id uuid,
    status character varying(20) NOT NULL,
    numero_documento character varying(80),
    descricao character varying(255) NOT NULL,
    observacoes text,
    CONSTRAINT contas_receber_status_check CHECK (((status)::text = ANY ((ARRAY['ABERTO'::character varying, 'PARCIAL'::character varying, 'PAGO'::character varying, 'VENCIDO'::character varying, 'CANCELADO'::character varying, 'ESTORNADO'::character varying])::text[])))
);


--
-- Name: pagamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagamentos (
    data_pagamento date NOT NULL,
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
    conta_pagar_id uuid NOT NULL,
    estornado_por uuid,
    forma_pagamento_id uuid,
    id uuid NOT NULL,
    parcela_pagar_id uuid,
    motivo_estorno character varying(255)
);


--
-- Name: parcelas_pagar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parcelas_pagar (
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
    conta_pagar_id uuid NOT NULL,
    id uuid NOT NULL,
    status character varying(20) NOT NULL,
    CONSTRAINT parcelas_pagar_status_check CHECK (((status)::text = ANY ((ARRAY['ABERTA'::character varying, 'PARCIAL'::character varying, 'PAGA'::character varying, 'VENCIDA'::character varying, 'CANCELADA'::character varying, 'ESTORNADA'::character varying])::text[])))
);


--
-- Name: parcelas_receber; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: rateios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rateios (
    percentual numeric(9,4),
    valor numeric(19,4),
    atualizado_em timestamp(6) with time zone NOT NULL,
    criado_em timestamp(6) with time zone NOT NULL,
    empresa_id bigint NOT NULL,
    excluido_em timestamp(6) with time zone,
    centro_custo_id uuid,
    id uuid NOT NULL,
    origem_id uuid NOT NULL,
    plano_conta_id uuid,
    origem_tipo character varying(30) NOT NULL
);


--
-- Name: recebimentos; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: recorrencias_financeiras; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: anexos_financeiros anexos_financeiros_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anexos_financeiros
    ADD CONSTRAINT anexos_financeiros_pkey PRIMARY KEY (id);


--
-- Name: contas_pagar contas_pagar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_pkey PRIMARY KEY (id);


--
-- Name: contas_receber contas_receber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contas_receber
    ADD CONSTRAINT contas_receber_pkey PRIMARY KEY (id);


--
-- Name: pagamentos pagamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_pkey PRIMARY KEY (id);


--
-- Name: parcelas_pagar parcelas_pagar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parcelas_pagar
    ADD CONSTRAINT parcelas_pagar_pkey PRIMARY KEY (id);


--
-- Name: parcelas_receber parcelas_receber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parcelas_receber
    ADD CONSTRAINT parcelas_receber_pkey PRIMARY KEY (id);


--
-- Name: rateios rateios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rateios
    ADD CONSTRAINT rateios_pkey PRIMARY KEY (id);


--
-- Name: recebimentos recebimentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recebimentos
    ADD CONSTRAINT recebimentos_pkey PRIMARY KEY (id);


--
-- Name: recorrencias_financeiras recorrencias_financeiras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recorrencias_financeiras
    ADD CONSTRAINT recorrencias_financeiras_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


