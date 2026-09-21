package br.com.poolcontrol.pool.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PoolRequest(
                @NotNull Long customerId,
                @NotBlank String model,
                @DecimalMin("0.00") BigDecimal lengthM,
                @DecimalMin("0.00") BigDecimal widthM,
                @DecimalMin("0.00") BigDecimal depthM,
                @DecimalMin("0.00") BigDecimal volumeLiters,
                String motor,
                String filter,
                LocalDate warrantyUntil,
                String notes) {
}
