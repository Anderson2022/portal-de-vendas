package br.com.poolcontrol.user.dto;



import br.com.poolcontrol.user.entity.Role;
import br.com.poolcontrol.user.entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public record UserResponse(
        Long id,
        String name,
        String email,
        boolean active,
        Set<String> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isActive(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }
}
