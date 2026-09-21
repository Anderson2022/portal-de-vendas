package br.com.poolcontrol.supplier.dto;
import br.com.poolcontrol.supplier.entity.Supplier;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SupplierRequest(
        @NotBlank String name,
        String documentNumber,
        String phone,
        @Email String email
) {
}
