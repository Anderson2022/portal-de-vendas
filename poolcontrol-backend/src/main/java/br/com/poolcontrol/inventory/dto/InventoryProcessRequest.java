package br.com.poolcontrol.inventory.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;
public final class InventoryProcessRequest {
 public record Create(@NotBlank String type,@NotNull Long warehouseId,boolean blind,boolean doubleCount,boolean blockMovements,String notes,List<Long> productIds,Long categoryId,Long locationId,String lot){}
 public record Count(@NotNull @DecimalMin("0") BigDecimal quantity,String notes){}
 public record Approve(String reason,String notes){}
 public record Cancel(@NotBlank String reason){}
 private InventoryProcessRequest(){}
}
