-- Migration V6_14__criar_funcao_sincronizar_detalhes_produto.sql
-- Parte da V6: normalizacao dos detalhes de produto.

CREATE OR REPLACE FUNCTION sincronizar_detalhes_produto() RETURNS TRIGGER AS $$
DECLARE d JSONB := COALESCE(NULLIF(NEW.details_json, ''), '{}')::JSONB;
BEGIN
  INSERT INTO produto_identificacao (empresa_id,produto_id,codigo_interno,referencia_fabricante)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'internalCode',''),NULLIF(d->>'manufacturerReference',''))
  ON CONFLICT (produto_id) DO UPDATE SET codigo_interno=EXCLUDED.codigo_interno,referencia_fabricante=EXCLUDED.referencia_fabricante;

  INSERT INTO produto_precos (empresa_id,produto_id,preco_minimo,preco_promocional,promocao_inicio,promocao_fim,margem_minima,desconto_maximo,comissao,quantidade_minima_venda)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'minimumSalePrice','')::NUMERIC,NULLIF(d->>'promotionalPrice','')::NUMERIC,NULLIF(d->>'promotionStartsAt','')::DATE,NULLIF(d->>'promotionEndsAt','')::DATE,NULLIF(d->>'minimumMargin','')::NUMERIC,NULLIF(d->>'maximumDiscount','')::NUMERIC,NULLIF(d->>'commissionRate','')::NUMERIC,NULLIF(d->>'minimumSaleQuantity','')::NUMERIC)
  ON CONFLICT (produto_id) DO UPDATE SET preco_minimo=EXCLUDED.preco_minimo,preco_promocional=EXCLUDED.preco_promocional,promocao_inicio=EXCLUDED.promocao_inicio,promocao_fim=EXCLUDED.promocao_fim,margem_minima=EXCLUDED.margem_minima,desconto_maximo=EXCLUDED.desconto_maximo,comissao=EXCLUDED.comissao,quantidade_minima_venda=EXCLUDED.quantidade_minima_venda;

  INSERT INTO produto_estoque_configuracao (empresa_id,produto_id,estoque_maximo,ponto_reposicao,localizacao,controla_lote,controla_validade,controla_serie,controla_estoque,exibir_venda,permite_venda_fracionada,exige_instalacao)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'maximumStock','')::NUMERIC,NULLIF(d->>'reorderPoint','')::NUMERIC,NULLIF(d->>'location',''),COALESCE((d->>'batchControlled')::BOOLEAN,FALSE),COALESCE((d->>'expirationControlled')::BOOLEAN,FALSE),COALESCE((d->>'serialControlled')::BOOLEAN,FALSE),COALESCE((d->>'stockControlled')::BOOLEAN,TRUE),COALESCE((d->>'showInSales')::BOOLEAN,TRUE),COALESCE((d->>'allowFractionalSale')::BOOLEAN,FALSE),COALESCE((d->>'requiresInstallation')::BOOLEAN,FALSE))
  ON CONFLICT (produto_id) DO UPDATE SET estoque_maximo=EXCLUDED.estoque_maximo,ponto_reposicao=EXCLUDED.ponto_reposicao,localizacao=EXCLUDED.localizacao,controla_lote=EXCLUDED.controla_lote,controla_validade=EXCLUDED.controla_validade,controla_serie=EXCLUDED.controla_serie,controla_estoque=EXCLUDED.controla_estoque,exibir_venda=EXCLUDED.exibir_venda,permite_venda_fracionada=EXCLUDED.permite_venda_fracionada,exige_instalacao=EXCLUDED.exige_instalacao;

  INSERT INTO produto_fiscal (empresa_id,produto_id,ncm,cest,origem_mercadoria,cfop_venda,codigo_icms,codigo_pis,codigo_cofins,codigo_ipi,gtin_tributavel,fator_conversao_tributavel,codigo_beneficio_fiscal)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'ncm',''),NULLIF(d->>'cest',''),NULLIF(d->>'fiscalOrigin',''),NULLIF(d->>'saleCfop',''),NULLIF(d->>'icmsCode',''),NULLIF(d->>'pisCode',''),NULLIF(d->>'cofinsCode',''),NULLIF(d->>'ipiCode',''),NULLIF(d->>'taxBarcode',''),NULLIF(d->>'taxConversionFactor','')::NUMERIC,NULLIF(d->>'taxBenefitCode',''))
  ON CONFLICT (produto_id) DO UPDATE SET ncm=EXCLUDED.ncm,cest=EXCLUDED.cest,origem_mercadoria=EXCLUDED.origem_mercadoria,cfop_venda=EXCLUDED.cfop_venda,codigo_icms=EXCLUDED.codigo_icms,codigo_pis=EXCLUDED.codigo_pis,codigo_cofins=EXCLUDED.codigo_cofins,codigo_ipi=EXCLUDED.codigo_ipi,gtin_tributavel=EXCLUDED.gtin_tributavel,fator_conversao_tributavel=EXCLUDED.fator_conversao_tributavel,codigo_beneficio_fiscal=EXCLUDED.codigo_beneficio_fiscal;

  INSERT INTO produto_tecnico (empresa_id,produto_id,compatibilidade,assistencia_tecnica,garantia_geral_meses,link_manual)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'compatibility',''),NULLIF(d->>'technicalSupport',''),NULLIF(d->>'generalWarrantyMonths','')::INTEGER,NULLIF(d->>'manualUrl',''))
  ON CONFLICT (produto_id) DO UPDATE SET compatibilidade=EXCLUDED.compatibilidade,assistencia_tecnica=EXCLUDED.assistencia_tecnica,garantia_geral_meses=EXCLUDED.garantia_geral_meses,link_manual=EXCLUDED.link_manual;

  INSERT INTO produto_logistica (empresa_id,produto_id,codigo_fornecedor,unidades_por_embalagem,prazo_reposicao_dias,pedido_minimo_compra,peso_liquido,peso_bruto,comprimento_embalagem,largura_embalagem,altura_embalagem,condicoes_armazenamento)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'supplierProductCode',''),NULLIF(d->>'unitsPerPackage','')::NUMERIC,NULLIF(d->>'leadTimeDays','')::INTEGER,NULLIF(d->>'minimumPurchaseQuantity','')::NUMERIC,NULLIF(d->>'netWeight','')::NUMERIC,NULLIF(d->>'grossWeight','')::NUMERIC,NULLIF(d->>'packageLength','')::NUMERIC,NULLIF(d->>'packageWidth','')::NUMERIC,NULLIF(d->>'packageHeight','')::NUMERIC,NULLIF(d->>'storageConditions',''))
  ON CONFLICT (produto_id) DO UPDATE SET codigo_fornecedor=EXCLUDED.codigo_fornecedor,unidades_por_embalagem=EXCLUDED.unidades_por_embalagem,prazo_reposicao_dias=EXCLUDED.prazo_reposicao_dias,pedido_minimo_compra=EXCLUDED.pedido_minimo_compra,peso_liquido=EXCLUDED.peso_liquido,peso_bruto=EXCLUDED.peso_bruto,comprimento_embalagem=EXCLUDED.comprimento_embalagem,largura_embalagem=EXCLUDED.largura_embalagem,altura_embalagem=EXCLUDED.altura_embalagem,condicoes_armazenamento=EXCLUDED.condicoes_armazenamento;

  INSERT INTO produto_midia (empresa_id,produto_id,imagem,observacoes_internas,orientacoes_venda_instalacao)
  VALUES (NEW.empresa_id,NEW.id,NULLIF(d->>'imageDataUrl',''),NULLIF(d->>'internalNotes',''),NULLIF(d->>'salesNotes',''))
  ON CONFLICT (produto_id) DO UPDATE SET imagem=EXCLUDED.imagem,observacoes_internas=EXCLUDED.observacoes_internas,orientacoes_venda_instalacao=EXCLUDED.orientacoes_venda_instalacao;

  INSERT INTO produto_especificacoes (empresa_id,produto_id,tensao_id,potencia,garantia_meses,modelo_piscina,comprimento,largura,profundidade,volume,cor,modelo_filtro,vazao,tamanho_embalagem,concentracao,principio_ativo,modo_aplicacao)
  VALUES (NEW.empresa_id,NEW.id,(SELECT id FROM tensoes_produto WHERE empresa_id=NEW.empresa_id AND codigo=d->>'voltage'),NULLIF(d->>'power',''),NULLIF(d->>'warrantyMonths','')::INTEGER,NULLIF(d->>'poolModel',''),NULLIF(d->>'length','')::NUMERIC,NULLIF(d->>'width','')::NUMERIC,NULLIF(d->>'depth','')::NUMERIC,NULLIF(d->>'volume','')::NUMERIC,NULLIF(d->>'color',''),NULLIF(d->>'filterModel',''),NULLIF(d->>'flowRate',''),NULLIF(d->>'packageSize',''),NULLIF(d->>'concentration',''),NULLIF(d->>'activeIngredient',''),NULLIF(d->>'applicationMode',''))
  ON CONFLICT (produto_id) DO UPDATE SET tensao_id=EXCLUDED.tensao_id,potencia=EXCLUDED.potencia,garantia_meses=EXCLUDED.garantia_meses,modelo_piscina=EXCLUDED.modelo_piscina,comprimento=EXCLUDED.comprimento,largura=EXCLUDED.largura,profundidade=EXCLUDED.profundidade,volume=EXCLUDED.volume,cor=EXCLUDED.cor,modelo_filtro=EXCLUDED.modelo_filtro,vazao=EXCLUDED.vazao,tamanho_embalagem=EXCLUDED.tamanho_embalagem,concentracao=EXCLUDED.concentracao,principio_ativo=EXCLUDED.principio_ativo,modo_aplicacao=EXCLUDED.modo_aplicacao;

  DELETE FROM produto_variacoes_preco WHERE produto_id=NEW.id;
  INSERT INTO produto_variacoes_preco (empresa_id,produto_id,descricao,quantidade_minima,preco)
  SELECT NEW.empresa_id,NEW.id,v->>'label',(v->>'quantity')::NUMERIC,(v->>'price')::NUMERIC FROM jsonb_array_elements(COALESCE(NULLIF(d->>'priceVariants','')::JSONB,'[]')) v;
  DELETE FROM produto_componentes_kit WHERE produto_id=NEW.id;
  INSERT INTO produto_componentes_kit (empresa_id,produto_id,descricao,quantidade,unidade)
  SELECT NEW.empresa_id,NEW.id,v->>'description',(v->>'quantity')::NUMERIC,v->>'unit' FROM jsonb_array_elements(COALESCE(NULLIF(d->>'kitComponents','')::JSONB,'[]')) v;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
