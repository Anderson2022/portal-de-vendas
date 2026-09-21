package br.com.poolcontrol.shared.security;



import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class CurrentUserService {

    public CurrentUser get() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken token)) {
            throw new IllegalStateException("UsuÃ¡rio nÃ£o autenticado");
        }

        var jwt = token.getToken();
        Long userId = Long.parseLong(jwt.getSubject());
        Long companyId = Long.parseLong(jwt.getClaimAsString("companyId"));
        String email = jwt.getClaimAsString("email");

        List<String> roleList = jwt.getClaimAsStringList("roles");
        List<String> permissionList = jwt.getClaimAsStringList("permissions");

        return new CurrentUser(
                userId,
                companyId,
                email,
                roleList == null ? Set.of() : new HashSet<>(roleList),
                permissionList == null ? Set.of() : new HashSet<>(permissionList)
        );
    }

    public Long companyId() {
        return get().companyId();
    }

    public Long userId() {
        return get().userId();
    }
}
