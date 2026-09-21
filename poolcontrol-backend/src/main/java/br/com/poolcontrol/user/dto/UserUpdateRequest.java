package br.com.poolcontrol.user.dto;
import br.com.poolcontrol.user.entity.User;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserUpdateRequest(
        @NotBlank @Size(max = 140) String name,
        boolean active,
        Set<String> roles
) {
}
