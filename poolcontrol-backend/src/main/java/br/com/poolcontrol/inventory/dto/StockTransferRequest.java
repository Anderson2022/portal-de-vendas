package br.com.poolcontrol.inventory.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
public record StockTransferRequest(@NotNull Long originWarehouseId,@NotNull Long destinationWarehouseId,String reason,String notes,boolean requestNow,@NotEmpty List<@Valid Item> items) {
 public record Item(@NotNull Long productId,@NotNull Long unitId,@NotNull @DecimalMin("0.000001") BigDecimal quantity,Long originLocationId,Long destinationLocationId,String lot,LocalDate expiration,String serialNumber,String notes) {}
}
