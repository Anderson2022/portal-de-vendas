package br.com.poolcontrol.salesperson.dto;
import br.com.poolcontrol.salesperson.entity.Salesperson;



import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SalespersonRequest(
        Long userId,
        @NotBlank String name,
        @Email String email,
        String phone,
        @NotNull @DecimalMin("0.00") BigDecimal defaultCommissionRate,
        @NotNull @DecimalMin("0.00") BigDecimal monthlyTarget
) {
}
