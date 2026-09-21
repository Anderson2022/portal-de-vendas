package br.com.poolcontrol.shared.security;



import java.util.Set;

public record CurrentUser(
        Long userId,
        Long companyId,
        String email,
        Set<String> roles,
        Set<String> permissions
) {
}
