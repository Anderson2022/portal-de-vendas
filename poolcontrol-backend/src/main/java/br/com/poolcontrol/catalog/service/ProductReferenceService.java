package br.com.poolcontrol.catalog.service;

import br.com.poolcontrol.catalog.dto.ProductReferenceRequest;
import br.com.poolcontrol.catalog.dto.ProductReferenceResponse;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductReferenceService {
    private static final Map<String, String> TABLES = Map.ofEntries(
            Map.entry("category", "categorias_produto"), Map.entry("brand", "marcas"), Map.entry("supplier", "fornecedores"),
            Map.entry("unit", "unidades_medida"), Map.entry("type", "tipos_produto"), Map.entry("warehouse", "depositos"),
            Map.entry("manufacturer", "fabricantes"), Map.entry("model", "modelos_produto"), Map.entry("material", "materiais"), Map.entry("finish", "acabamentos"));
    private final JdbcClient jdbc;
    private final CurrentUserService currentUser;

    public List<ProductReferenceResponse> list(String kind) {
        String table = table(kind);
        String name = kind.equals("brand") ? "nome" : "name";
        String company = kind.equals("brand") ? "empresa_id" : "empresa_id";
        String active = kind.equals("brand") ? "ativo" : kind.equals("category") ? "true" : "active";
        String code = kind.equals("supplier") ? "NULL::varchar" : kind.matches("brand|category") ? "codigo" : "code";
        String id = "id::varchar";
        return jdbc.sql("SELECT " + id + " id, " + name + " name, " + code + " code FROM " + table + " WHERE " + company + "=:company AND " + active + "=true ORDER BY " + name)
                .param("company", currentUser.companyId()).query(ProductReferenceResponse.class).list();
    }

    public Map<String, Object> get(String kind, Long id) {
        String table = table(kind);
        String columns = kind.equals("brand")
                ? "id,nome name,codigo code,descricao description,NULL::varchar document_number,contato phone,NULL::varchar email,NULL::varchar address,NULL::varchar city,NULL::varchar state,site website,observacoes notes,ativo active,nome_reduzido short_name,fabricante_id manufacturer_id,codigo_externo external_code,logo_url logo_url"
                : kind.equals("category")
                ? "id,name,codigo code,descricao description,NULL::varchar document_number,NULL::varchar phone,NULL::varchar email,NULL::varchar address,NULL::varchar city,NULL::varchar state,NULL::varchar website,observacoes notes,ativo active,categoria_pai_id parent_category_id,descricao_seo seo_description,imagem_capa cover_image,nivel,ordem_exibicao,controla_lote,controla_validade,controla_serie,permite_estoque_negativo,estoque_minimo_padrao,estoque_maximo_padrao,estoque_seguranca_padrao,metodo_saida_padrao,dias_sem_movimento,codigo_externo"
                : kind.equals("supplier")
                ? "id,name,NULL::varchar code,NULL::text description,document_number,phone,email,endereco address,cidade city,estado state,site website,observacoes notes,active"
                : kind.equals("unit")
                ? "id,name,code,description,NULL::varchar document_number,NULL::varchar phone,NULL::varchar email,NULL::varchar address,NULL::varchar city,NULL::varchar state,NULL::varchar website,notes,active,sigla unit_symbol,tipo unit_type,casas_decimais decimal_places,unidade_base_id base_unit_id,fator_conversao conversion_factor"
                : kind.equals("type")
                ? "id,name,code,description,NULL::varchar document_number,NULL::varchar phone,NULL::varchar email,NULL::varchar address,NULL::varchar city,NULL::varchar state,NULL::varchar website,notes,active,produto_fisico physical_product,controla_estoque stock_controlled,permite_compra purchase_allowed,permite_venda sale_allowed,controla_lote batch_control,controla_validade expiration_control,controla_serie serial_control,codigo_tipo_item_fiscal fiscal_item_type_code"
                : "id,name,code,description,NULL::varchar document_number,phone,email,address,city,state,website,notes,active";
        return jdbc.sql("SELECT " + columns + " FROM " + table + " WHERE id=:id AND empresa_id=:company")
                .param("id", id).param("company", currentUser.companyId()).query().singleRow();
    }

    @Transactional
    public ProductReferenceResponse create(String kind, ProductReferenceRequest request) {
        String table = table(kind);
        if (kind.equals("brand")) {
            return jdbc.sql("INSERT INTO marcas (empresa_id,codigo,nome,nome_reduzido,descricao,fabricante_id,codigo_externo,site,logo_url,contato,observacoes,ativo,criado_em,atualizado_em) VALUES (:company,:code,:name,:shortName,:description,:manufacturer,:externalCode,:website,:logo,:phone,:notes,:active,now(),now()) RETURNING id::varchar id,nome name,codigo code")
                    .param("company", currentUser.companyId()).param("code",blankToNull(request.code())).param("name", request.name().trim()).param("shortName",request.shortName()).param("description",request.description()).param("manufacturer",request.manufacturerId()).param("externalCode",request.externalCode()).param("website",request.website()).param("logo",request.logoUrl()).param("phone",request.phone()).param("notes",request.notes()).param("active",request.active()==null||request.active()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("category")) {
            Long categoryId = Boolean.FALSE.equals(request.automaticId()) && request.requestedId() != null
                    ? request.requestedId()
                    : jdbc.sql("SELECT nextval('categorias_produto_id_seq')").query(Long.class).single();
            String categoryCode = request.code() == null || request.code().isBlank()
                    ? "CAT-" + String.format("%03d", categoryId)
                    : request.code().trim().toUpperCase();
            ProductReferenceResponse saved = jdbc.sql("INSERT INTO categorias_produto (id,empresa_id,codigo,name,descricao,ativo,categoria_pai_id,nivel,ordem_exibicao,controla_lote,controla_validade,controla_serie,permite_estoque_negativo,estoque_minimo_padrao,estoque_maximo_padrao,estoque_seguranca_padrao,metodo_saida_padrao,dias_sem_movimento,codigo_externo,observacoes,descricao_seo,imagem_capa,criado_por,alterado_por,created_at,updated_at) VALUES (:categoryId,:company,:code,:name,:description,:active,:parent,COALESCE((SELECT nivel+1 FROM categorias_produto WHERE id=:parent AND empresa_id=:company),1),:displayOrder,:batch,:expiration,:serial,:negative,:minimum,:maximum,:safety,:method,:inactiveDays,:externalCode,:notes,:seo,:cover,:userId,:userId,now(),now()) RETURNING id::varchar id,name,codigo code")
                    .param("categoryId", categoryId)
                    .param("company", currentUser.companyId()).param("userId",currentUser.userId()).param("code",categoryCode).param("name", request.name().trim()).param("description",request.description()).param("active",request.active()==null||request.active()).param("parent",request.parentCategoryId()).param("displayOrder",request.displayOrder()).param("batch",Boolean.TRUE.equals(request.batchControlled())).param("expiration",Boolean.TRUE.equals(request.expirationControlled())).param("serial",Boolean.TRUE.equals(request.serialControlled())).param("negative",Boolean.TRUE.equals(request.allowNegativeStock())).param("minimum",request.defaultMinimumStock()).param("maximum",request.defaultMaximumStock()).param("safety",request.defaultSafetyStock()).param("method",blankToNull(request.defaultIssueMethod())).param("inactiveDays",request.inactiveDays()).param("externalCode",request.externalCode()).param("notes",request.notes()).param("seo",request.seoDescription()).param("cover",request.coverImage()).query(ProductReferenceResponse.class).single();
            jdbc.sql("SELECT setval('categorias_produto_id_seq', GREATEST((SELECT MAX(id) FROM categorias_produto), 1))").query(Long.class).single();
            return saved;
        }
        if (kind.equals("supplier")) {
            return jdbc.sql("INSERT INTO fornecedores (empresa_id,name,document_number,phone,email,endereco,cidade,estado,site,observacoes,active,created_at,updated_at) VALUES (:company,:name,:document,:phone,:email,:address,:city,:state,:website,:notes,:active,now(),now()) RETURNING id::varchar id,name,NULL::varchar code")
                    .param("company", currentUser.companyId()).param("name", request.name().trim()).param("document",request.documentNumber()).param("phone",request.phone()).param("email",request.email()).param("address",request.address()).param("city",request.city()).param("state",request.state()).param("website",request.website()).param("notes",request.notes()).param("active",request.active()==null||request.active()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("unit")) {
            if (request.baseUnitId()!=null && (request.conversionFactor()==null || request.conversionFactor().signum()<=0)) throw new BusinessException("Informe um fator de conversão maior que zero.");
            validateBaseUnit(request.baseUnitId(), request.unitType());
            return jdbc.sql("INSERT INTO unidades_medida (empresa_id,name,code,sigla,description,tipo,casas_decimais,unidade_base_id,fator_conversao,active,created_at,updated_at) VALUES (:company,:name,:code,:symbol,:description,:type,:decimals,:base,:factor,:active,now(),now()) RETURNING id::varchar id,name,code")
                    .param("company",currentUser.companyId()).param("name",request.name().trim()).param("code",request.code().trim().toUpperCase()).param("symbol",request.unitSymbol().trim()).param("description",request.description()).param("type",request.unitType()).param("decimals",request.decimalPlaces()==null?0:request.decimalPlaces()).param("base",request.baseUnitId()).param("factor",request.baseUnitId()==null?java.math.BigDecimal.ONE:request.conversionFactor()).param("active",request.active()==null||request.active()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("type")) {
            return jdbc.sql("INSERT INTO tipos_produto (empresa_id,name,code,description,produto_fisico,controla_estoque,permite_compra,permite_venda,controla_lote,controla_validade,controla_serie,codigo_tipo_item_fiscal,active,created_at,updated_at) VALUES (:company,:name,:code,:description,:physical,:stock,:purchase,:sale,:batch,:expiration,:serial,:fiscal,:active,now(),now()) RETURNING id::varchar id,name,code")
                    .param("company",currentUser.companyId()).param("name",request.name().trim()).param("code",request.code().trim().toUpperCase()).param("description",request.description()).param("physical",trueOrDefault(request.physicalProduct())).param("stock",trueOrDefault(request.stockControlled())).param("purchase",trueOrDefault(request.purchaseAllowed())).param("sale",trueOrDefault(request.saleAllowed())).param("batch",Boolean.TRUE.equals(request.batchControl())).param("expiration",Boolean.TRUE.equals(request.expirationControl())).param("serial",Boolean.TRUE.equals(request.serialControl())).param("fiscal",blankToNull(request.fiscalItemTypeCode())).param("active",trueOrDefault(request.active())).query(ProductReferenceResponse.class).single();
        }
        return jdbc.sql("INSERT INTO " + table + " (empresa_id,name,code,description,phone,email,address,city,state,website,notes,active,created_at,updated_at) VALUES (:company,:name,:code,:description,:phone,:email,:address,:city,:state,:website,:notes,:active,now(),now()) RETURNING id::varchar id,name,code")
                .param("company", currentUser.companyId()).param("name", request.name().trim())
                .param("code", request.code() == null || request.code().isBlank() ? null : request.code().trim().toUpperCase())
                .param("description",request.description()).param("phone",request.phone()).param("email",request.email()).param("address",request.address()).param("city",request.city()).param("state",request.state()).param("website",request.website()).param("notes",request.notes()).param("active",request.active()==null||request.active())
                .query(ProductReferenceResponse.class).single();
    }

    @Transactional
    public ProductReferenceResponse update(String kind, Long id, ProductReferenceRequest request) {
        String table = table(kind);
        if (kind.equals("brand")) {
            return jdbc.sql("UPDATE marcas SET codigo=:code,nome=:name,nome_reduzido=:shortName,descricao=:description,fabricante_id=:manufacturer,codigo_externo=:externalCode,site=:website,logo_url=:logo,contato=:phone,observacoes=:notes,ativo=:active,atualizado_em=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,nome name,codigo code")
                    .params(Map.of("id",id,"company",currentUser.companyId(),"name",request.name().trim(),"active",request.active()==null||request.active()))
                    .param("code",blankToNull(request.code())).param("shortName",request.shortName()).param("description",request.description()).param("manufacturer",request.manufacturerId()).param("externalCode",request.externalCode()).param("website",request.website()).param("logo",request.logoUrl()).param("phone",request.phone()).param("notes",request.notes()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("category")) {
            return jdbc.sql("UPDATE categorias_produto SET codigo=:code,name=:name,descricao=:description,ativo=:active,categoria_pai_id=:parent,nivel=COALESCE((SELECT nivel+1 FROM categorias_produto pai WHERE pai.id=:parent AND pai.empresa_id=:company),1),ordem_exibicao=:displayOrder,controla_lote=:batch,controla_validade=:expiration,controla_serie=:serial,permite_estoque_negativo=:negative,estoque_minimo_padrao=:minimum,estoque_maximo_padrao=:maximum,estoque_seguranca_padrao=:safety,metodo_saida_padrao=:method,dias_sem_movimento=:inactiveDays,codigo_externo=:externalCode,observacoes=:notes,descricao_seo=:seo,imagem_capa=:cover,alterado_por=:userId,updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,name,codigo code")
                    .params(Map.of("id",id,"company",currentUser.companyId(),"userId",currentUser.userId(),"code",request.code().trim().toUpperCase(),"name",request.name().trim(),"active",request.active()==null||request.active(),"batch",Boolean.TRUE.equals(request.batchControlled()),"expiration",Boolean.TRUE.equals(request.expirationControlled()),"serial",Boolean.TRUE.equals(request.serialControlled()),"negative",Boolean.TRUE.equals(request.allowNegativeStock()))).param("description",request.description()).param("parent",request.parentCategoryId()).param("displayOrder",request.displayOrder()).param("minimum",request.defaultMinimumStock()).param("maximum",request.defaultMaximumStock()).param("safety",request.defaultSafetyStock()).param("method",blankToNull(request.defaultIssueMethod())).param("inactiveDays",request.inactiveDays()).param("externalCode",request.externalCode()).param("notes",request.notes()).param("seo",request.seoDescription()).param("cover",request.coverImage()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("supplier")) {
            return jdbc.sql("UPDATE fornecedores SET name=:name,document_number=:document,phone=:phone,email=:email,endereco=:address,cidade=:city,estado=:state,site=:website,observacoes=:notes,active=:active,updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,name,NULL::varchar code")
                    .params(Map.of("id",id,"company",currentUser.companyId(),"name",request.name().trim(),"active",request.active()==null||request.active())).param("document",request.documentNumber()).param("phone",request.phone()).param("email",request.email()).param("address",request.address()).param("city",request.city()).param("state",request.state()).param("website",request.website()).param("notes",request.notes()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("unit")) {
            if (id.equals(request.baseUnitId())) throw new BusinessException("A unidade não pode ser referência dela mesma.");
            if (request.baseUnitId()!=null && (request.conversionFactor()==null || request.conversionFactor().signum()<=0)) throw new BusinessException("Informe um fator de conversão maior que zero.");
            validateBaseUnit(request.baseUnitId(), request.unitType());
            return jdbc.sql("UPDATE unidades_medida SET name=:name,code=:code,sigla=:symbol,description=:description,tipo=:type,casas_decimais=:decimals,unidade_base_id=:base,fator_conversao=:factor,active=:active,updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,name,code")
                    .params(Map.of("id",id,"company",currentUser.companyId(),"name",request.name().trim(),"code",request.code().trim().toUpperCase(),"symbol",request.unitSymbol().trim(),"type",request.unitType(),"decimals",request.decimalPlaces()==null?0:request.decimalPlaces(),"active",request.active()==null||request.active())).param("description",request.description()).param("base",request.baseUnitId()).param("factor",request.baseUnitId()==null?java.math.BigDecimal.ONE:request.conversionFactor()).query(ProductReferenceResponse.class).single();
        }
        if (kind.equals("type")) {
            return jdbc.sql("UPDATE tipos_produto SET name=:name,code=:code,description=:description,produto_fisico=:physical,controla_estoque=:stock,permite_compra=:purchase,permite_venda=:sale,controla_lote=:batch,controla_validade=:expiration,controla_serie=:serial,codigo_tipo_item_fiscal=:fiscal,active=:active,updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,name,code")
                    .params(Map.of("id",id,"company",currentUser.companyId(),"name",request.name().trim(),"code",request.code().trim().toUpperCase()))
                    .param("physical",trueOrDefault(request.physicalProduct())).param("stock",trueOrDefault(request.stockControlled())).param("purchase",trueOrDefault(request.purchaseAllowed())).param("sale",trueOrDefault(request.saleAllowed())).param("batch",Boolean.TRUE.equals(request.batchControl())).param("expiration",Boolean.TRUE.equals(request.expirationControl())).param("serial",Boolean.TRUE.equals(request.serialControl())).param("active",trueOrDefault(request.active())).param("description",request.description()).param("fiscal",blankToNull(request.fiscalItemTypeCode())).query(ProductReferenceResponse.class).single();
        }
        return jdbc.sql("UPDATE " + table + " SET name=:name,code=:code,description=:description,phone=:phone,email=:email,address=:address,city=:city,state=:state,website=:website,notes=:notes,active=:active,updated_at=now() WHERE id=:id AND empresa_id=:company RETURNING id::varchar id,name,code")
                .params(Map.of("id",id,"company",currentUser.companyId(),"name",request.name().trim(),"active",request.active()==null||request.active()))
                .param("code",request.code()).param("description",request.description()).param("phone",request.phone()).param("email",request.email()).param("address",request.address()).param("city",request.city()).param("state",request.state()).param("website",request.website()).param("notes",request.notes()).query(ProductReferenceResponse.class).single();
    }

    @Transactional
    public void delete(String kind, Long id) {
        String table = table(kind);
        try {
            int deleted = jdbc.sql("DELETE FROM " + table + " WHERE id=:id AND empresa_id=:company")
                    .param("id", id).param("company", currentUser.companyId()).update();
            if (deleted == 0) throw new BusinessException("Registro não encontrado.");
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException("Não é possível excluir: este registro possui relacionamentos.");
        }
    }

    private String table(String kind) {
        String table = TABLES.get(kind);
        if (table == null) throw new BusinessException("Tipo de referência inválido");
        return table;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim().toUpperCase();
    }

    private boolean trueOrDefault(Boolean value) { return value == null || value; }

    private void validateBaseUnit(Long baseUnitId, String type) {
        if (baseUnitId == null) return;
        boolean valid = jdbc.sql("SELECT EXISTS(SELECT 1 FROM unidades_medida WHERE id=:id AND empresa_id=:company AND tipo=:type AND active)")
                .param("id",baseUnitId).param("company",currentUser.companyId()).param("type",type).query(Boolean.class).single();
        if (!valid) throw new BusinessException("Selecione uma unidade de referência ativa e do mesmo tipo.");
    }
}
