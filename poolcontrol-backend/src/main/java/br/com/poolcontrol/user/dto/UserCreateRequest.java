package br.com.poolcontrol.user.dto;
import br.com.poolcontrol.user.entity.User;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserCreateRequest(
        @NotBlank @Size(max = 140) String name,
        @Email @NotBlank @Size(max = 180) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        Set<String> roles
) {
}
