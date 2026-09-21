package br.com.poolcontrol.user.dto;
import br.com.poolcontrol.user.entity.User;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPasswordRequest(
        @NotBlank @Size(min = 8, max = 100) String password
) {
}
