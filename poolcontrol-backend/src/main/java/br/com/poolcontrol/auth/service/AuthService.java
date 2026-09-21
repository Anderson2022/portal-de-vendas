package br.com.poolcontrol.auth.service;



import br.com.poolcontrol.auth.dto.LoginRequest;
import br.com.poolcontrol.auth.dto.LoginResponse;
import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.user.entity.Role;
import br.com.poolcontrol.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    @Value("${poolcontrol.jwt.issuer}")
    private String issuer;

    @Value("${poolcontrol.jwt.expiration-minutes}")
    private long expirationMinutes;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BusinessException("E-mail ou senha invÃ¡lidos"));

        if (!user.isActive() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("E-mail ou senha invÃ¡lidos");
        }

        var roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toUnmodifiableSet());

        Set<String> permissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .collect(Collectors.toUnmodifiableSet());

        Instant now = Instant.now();
        Instant expiresAt = now.plus(expirationMinutes, ChronoUnit.MINUTES);

        var claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(user.getId().toString())
                .claim("companyId", user.getCompanyId().toString())
                .claim("name", user.getName())
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .claim("permissions", permissions)
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(org.springframework.security.oauth2.jwt.JwsHeader.with(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256).build(), claims)).getTokenValue();

        user.setLastLoginAt(OffsetDateTime.now(ZoneOffset.UTC));

        return new LoginResponse(
                token,
                "Bearer",
                expiresAt,
                user.getId(),
                user.getCompanyId(),
                user.getName(),
                user.getEmail(),
                roles,
                permissions
        );
    }
}
