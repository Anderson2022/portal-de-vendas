package br.com.poolcontrol.financeiro.centros.orcamento;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
public record CostCenterBudgetRequest(
        @NotNull LocalDate period,
        @NotNull @DecimalMin("0") BigDecimal planned,
        @DecimalMin("0") BigDecimal revised,
        @Size(max = 10000) String notes) {}
