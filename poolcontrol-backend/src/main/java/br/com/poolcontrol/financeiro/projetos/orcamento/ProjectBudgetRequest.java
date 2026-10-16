package br.com.poolcontrol.financeiro.projetos.orcamento;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;
public record ProjectBudgetRequest(
        @NotNull UUID chartAccountId,
        @NotNull UUID costCenterId,
        @NotNull @DecimalMin("0") BigDecimal planned) {}
