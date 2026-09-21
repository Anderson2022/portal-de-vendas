package br.com.poolcontrol.catalog.dto;



import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductRequest(
        String sku,
        String barcode,
        @NotBlank String name,
        String description,
        Long categoryId,
        Long brandId,
        Long supplierId,
        Long defaultWarehouseId,
        Long defaultLocationId,
        Long defaultPositionId,
        String productType,
        Long productTypeId,
        Long unitId,
        Long taxUnitId,
        Long purchaseUnitId,
        BigDecimal unitsPerPackage,
        Long manufacturerId,
        Long modelId,
        Long materialId,
        Long finishId,
        String detailsJson,
        @NotNull @DecimalMin("0.00") BigDecimal costPrice,
        @NotNull @DecimalMin("0.00") BigDecimal salePrice,
        @NotNull @DecimalMin("0.00") BigDecimal minimumStock,
        @NotBlank String unit,
        boolean active
) {
}
