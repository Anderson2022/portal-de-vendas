package br.com.poolcontrol.financial.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PayableRequest(
                Long supplierId,
                @NotBlank String description,
                @NotNull @DecimalMin("0.01") BigDecimal amount,
                @NotNull LocalDate dueDate) {
}
