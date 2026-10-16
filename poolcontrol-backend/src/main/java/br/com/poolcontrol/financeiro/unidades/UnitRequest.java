package br.com.poolcontrol.financeiro.unidades;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.UUID;

public record UnitRequest(
        @NotBlank @Size(max = 30) String code,
        @NotBlank @Size(max = 150) String name,
        Long parentId,
        @NotBlank String type,
        Long responsibleId,
        @Size(max = 18) String cnpj,
        @Size(max = 120) String city,
        @Pattern(regexp = "^$|[A-Z]{2}") String state,
        @Size(max = 10000) String address,
        UUID defaultCostCenterId,
        UUID defaultBankAccountId,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 10000) String notes,
        boolean active) {}
