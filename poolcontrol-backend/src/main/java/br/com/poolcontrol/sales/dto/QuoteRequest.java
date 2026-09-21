package br.com.poolcontrol.sales.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record QuoteRequest(
                @NotNull Long customerId,
                Long salespersonId,
                @NotNull @DecimalMin("0.00") BigDecimal discount,
                LocalDate validUntil,
                @jakarta.validation.constraints.Size(max = 5000) String notes,
                @jakarta.validation.constraints.Size(max = 180) String project,
                @NotEmpty List<@Valid Item> items) {
        public record Item(
                        Long productId,
                        @NotNull String description,
                        @NotNull @DecimalMin("0.001") BigDecimal quantity,
                        @NotNull @DecimalMin("0.00") BigDecimal unitPrice,
                        @DecimalMin("0.00") BigDecimal unitCost) {
        }
}
