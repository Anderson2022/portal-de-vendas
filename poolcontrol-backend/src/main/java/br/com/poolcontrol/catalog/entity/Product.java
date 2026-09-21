package br.com.poolcontrol.catalog.entity;



import br.com.poolcontrol.shared.domain.TenantEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "produtos")
public class Product extends TenantEntity {

    @Column(length = 60)
    private String sku;

    @Column(name = "barcode", length = 60)
    private String barcode;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "default_warehouse_id")
    private Long defaultWarehouseId;

    @Column(name = "default_location_id")
    private Long defaultLocationId;

    @Column(name = "default_position_id")
    private Long defaultPositionId;

    private Long productTypeId;
    private Long unitId;
    private Long taxUnitId;
    private Long purchaseUnitId;
    private Long manufacturerId;
    private Long modelId;
    private Long materialId;
    private Long finishId;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "cost_price", nullable = false, precision = 14, scale = 2)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "sale_price", nullable = false, precision = 14, scale = 2)
    private BigDecimal salePrice = BigDecimal.ZERO;

    @Column(name = "minimum_stock", nullable = false, precision = 14, scale = 3)
    private BigDecimal minimumStock = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    private String unit = "UN";

    @Column(nullable = false)
    private boolean active = true;
}
