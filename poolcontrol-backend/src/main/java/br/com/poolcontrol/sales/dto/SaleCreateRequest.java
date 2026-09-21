package br.com.poolcontrol.sales.dto;

import br.com.poolcontrol.sales.entity.SaleCostType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record SaleCreateRequest(
                @NotNull Long customerId,
                Long salespersonId,
                @jakarta.validation.constraints.Size(max = 180) String project,
                @jakarta.validation.constraints.Size(max = 5000) String notes,
                @NotNull @DecimalMin("0.00") BigDecimal discount,
                @NotEmpty List<@Valid Item> items,
                List<@Valid Cost> costs,
                List<@Valid Payment> payments) {
        public record Item(
                        Long productId,
                        @NotNull String description,
                        @NotNull @DecimalMin("0.001") BigDecimal quantity,
                        @NotNull @DecimalMin("0.00") BigDecimal unitPrice,
                        @DecimalMin("0.00") BigDecimal unitCost) {
        }

        public record Cost(
                        @NotNull SaleCostType type,
                        @NotNull String description,
                        @NotNull @DecimalMin("0.00") BigDecimal amount) {
        }

        public record Payment(
                        @NotNull @DecimalMin("0.01") BigDecimal amount,
                        @NotNull LocalDate dueDate,
                        @NotNull String paymentMethod) {
        }
}
