package br.com.poolcontrol.financial.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

public record PayableAllocationRequest(
        @NotNull UUID costCenterId,
        @NotNull @DecimalMin("0.0001") @DecimalMax("100") BigDecimal percentage) {}
