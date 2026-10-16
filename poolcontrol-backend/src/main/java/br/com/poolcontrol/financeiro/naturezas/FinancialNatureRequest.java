package br.com.poolcontrol.financeiro.naturezas;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.UUID;

public record FinancialNatureRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 10000) String description,
        UUID parentId,
        @NotBlank String type,
        @NotBlank String group,
        @NotBlank String movement,
        boolean affectsCashFlow,
        boolean affectsDre,
        boolean affectsResult,
        boolean acceptsEntries,
        @Min(0) Integer displayOrder,
        @Size(max = 30) String color,
        @Size(max = 60) String icon,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 10000) String notes,
        boolean active) {
    public FinancialNatureRequest {
        if (displayOrder == null) displayOrder = 0;
    }
}
