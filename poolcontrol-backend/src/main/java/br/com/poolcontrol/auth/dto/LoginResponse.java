package br.com.poolcontrol.auth.dto;



import java.time.Instant;
import java.util.Set;

public record LoginResponse(
        String accessToken,
        String tokenType,
        Instant expiresAt,
        Long userId,
        Long companyId,
        String name,
        String email,
        Set<String> roles,
        Set<String> permissions
) {
}
