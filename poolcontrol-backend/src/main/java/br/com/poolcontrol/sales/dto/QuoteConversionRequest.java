package br.com.poolcontrol.sales.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record QuoteConversionRequest(@NotNull @Pattern(regexp = "PIX|DINHEIRO|CARTAO|BOLETO") String paymentMethod,
        @NotNull LocalDate dueDate, boolean paid) {
}
