package br.com.poolcontrol.financeiro.centros;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.UUID;

public record CostCenterRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 10000) String description,
        UUID parentId,
        @NotBlank String type,
        Long responsibleId,
        boolean acceptsEntries,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 10000) String notes,
        boolean active) {}
