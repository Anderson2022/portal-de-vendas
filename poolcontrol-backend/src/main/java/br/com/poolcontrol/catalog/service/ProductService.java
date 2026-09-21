package br.com.poolcontrol.catalog.service;



import br.com.poolcontrol.catalog.dto.ProductRequest;
import br.com.poolcontrol.catalog.entity.Product;
import br.com.poolcontrol.catalog.repository.ProductRepository;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final CurrentUserService currentUser;
    private final JdbcClient jdbc;

    @Transactional(readOnly = true)
    public List<Product> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId());
    }

    @Transactional(readOnly = true)
    public Product get(Long id) {
        return repository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("Produto nÃ£o encontrado"));
    }

    @Transactional
    public Product create(ProductRequest request) {
        var product = new Product();
        product.setCompanyId(currentUser.companyId());
        apply(product, request);
        Product saved = repository.saveAndFlush(product);
        syncUnits(saved, request, false);
        return saved;
    }

    @Transactional
    public Product update(Long id, ProductRequest request) {
        var product = get(id);
        apply(product, request);
        Product saved = repository.saveAndFlush(product);
        syncUnits(saved, request, true);
        return saved;
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(get(id));
    }

    private void apply(Product product, ProductRequest request) {
        product.setSku(request.sku());
        product.setBarcode(request.barcode());
        product.setName(request.name());
        product.setDescription(request.description());
        product.setCategoryId(request.categoryId());
        product.setBrandId(request.brandId());
        product.setSupplierId(request.supplierId());
        product.setDefaultWarehouseId(request.defaultWarehouseId());
        product.setDefaultLocationId(request.defaultLocationId());
        product.setDefaultPositionId(request.defaultPositionId());
        Long typeId = request.productTypeId();
        if (typeId == null && request.productType() != null) {
            typeId = jdbc.sql("SELECT id FROM tipos_produto WHERE empresa_id=:company AND code=:code")
                    .param("company", currentUser.companyId()).param("code", request.productType()).query(Long.class).optional().orElse(null);
        }
        product.setProductTypeId(typeId);
        Long unitId = request.unitId();
        if (unitId == null && request.unit() != null) {
            unitId = jdbc.sql("SELECT id FROM unidades_medida WHERE empresa_id=:company AND (code=:unit OR name=:unit)")
                    .param("company", currentUser.companyId()).param("unit", request.unit()).query(Long.class).optional().orElse(null);
        }
        product.setUnitId(unitId);
        product.setTaxUnitId(request.taxUnitId());
        product.setPurchaseUnitId(request.purchaseUnitId());
        product.setManufacturerId(request.manufacturerId());
        product.setModelId(request.modelId());
        product.setMaterialId(request.materialId());
        product.setFinishId(request.finishId());
        product.setDetailsJson(request.detailsJson());
        product.setCostPrice(request.costPrice());
        product.setSalePrice(request.salePrice());
        product.setMinimumStock(request.minimumStock());
        product.setUnit(request.unit());
        product.setActive(request.active());
    }

    private void syncUnits(Product product, ProductRequest request, boolean updating) {
        if (request.unitId() == null) return;
        if (updating) {
            Long oldBase = jdbc.sql("SELECT unidade_medida_id FROM produto_unidades_medida WHERE produto_id=:product AND unidade_base AND ativo")
                    .param("product", product.getId()).query(Long.class).optional().orElse(null);
            boolean hasMovements = jdbc.sql("SELECT EXISTS(SELECT 1 FROM stock_movements WHERE product_id=:product)")
                    .param("product", product.getId()).query(Boolean.class).single();
            if (hasMovements && oldBase != null && !oldBase.equals(request.unitId()))
                throw new IllegalArgumentException("A unidade base não pode ser alterada após movimentações de estoque.");
        }
        jdbc.sql("INSERT INTO produto_unidades_medida (produto_id,unidade_medida_id,fator_conversao,unidade_base,permite_compra,permite_venda,permite_estoque,codigo_barras,ativo) VALUES (:product,:unit,1,true,true,true,true,:barcode,true) ON CONFLICT (produto_id,unidade_medida_id) DO UPDATE SET fator_conversao=1,unidade_base=true,ativo=true,atualizado_em=now()")
                .param("product",product.getId()).param("unit",request.unitId()).param("barcode",request.barcode()).update();
        if (request.purchaseUnitId()!=null && !request.purchaseUnitId().equals(request.unitId()) && request.unitsPerPackage()!=null && request.unitsPerPackage().signum()>0) {
            jdbc.sql("INSERT INTO produto_unidades_medida (produto_id,unidade_medida_id,fator_conversao,unidade_base,permite_compra,permite_venda,permite_estoque,ativo) VALUES (:product,:unit,:factor,false,true,false,false,true) ON CONFLICT (produto_id,unidade_medida_id) DO UPDATE SET fator_conversao=:factor,permite_compra=true,ativo=true,atualizado_em=now()")
                    .param("product",product.getId()).param("unit",request.purchaseUnitId()).param("factor",request.unitsPerPackage()).update();
        }
    }
}
