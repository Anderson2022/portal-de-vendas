package br.com.poolcontrol.customer.dto;
import br.com.poolcontrol.customer.entity.Customer;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record CustomerRequest(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 20) String documentNumber,
        @Size(max = 30) String phone,
        @Size(max = 30) String whatsapp,
        @Email @Size(max = 180) String email,
        @Size(max = 220) String address,
        @Size(max = 120) String city,
        @Size(max = 2) String state,
        @Size(max = 80) String source,
        Long salespersonId
) {
}
