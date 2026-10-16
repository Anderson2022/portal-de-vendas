package br.com.poolcontrol.financeiro.projetos;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.UUID;

public record ProjectRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        Long customerId,
        Long unitId,
        UUID costCenterId,
        Long responsibleId,
        @NotBlank String type,
        @NotBlank String status,
        LocalDate startDate,
        LocalDate expectedEndDate,
        LocalDate actualEndDate,
        @NotNull @DecimalMin("0") BigDecimal contractAmount,
        @NotNull @DecimalMin("0") BigDecimal costBudget,
        @NotNull @DecimalMin("0") BigDecimal expectedRevenue,
        @Size(max = 10000) String description,
        @Size(max = 10000) String notes,
        boolean active) {}
