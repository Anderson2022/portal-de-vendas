package br.com.poolcontrol.user.dto;
import br.com.poolcontrol.user.entity.User;



import br.com.poolcontrol.user.entity.Role;

import java.util.Set;

public record RoleResponse(
        Long id,
        String name,
        Set<String> permissions
) {
    public static RoleResponse from(Role role) {
        return new RoleResponse(role.getId(), role.getName(), role.getPermissions());
    }
}
