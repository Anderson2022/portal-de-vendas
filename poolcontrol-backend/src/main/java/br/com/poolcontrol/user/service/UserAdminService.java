package br.com.poolcontrol.user.service;



import br.com.poolcontrol.shared.exception.BusinessException;
import br.com.poolcontrol.shared.exception.NotFoundException;
import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.user.dto.UserCreateRequest;
import br.com.poolcontrol.user.dto.UserResponse;
import br.com.poolcontrol.user.dto.UserUpdateRequest;
import br.com.poolcontrol.user.entity.Role;
import br.com.poolcontrol.user.entity.User;
import br.com.poolcontrol.user.repository.RoleRepository;
import br.com.poolcontrol.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUser;

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return userRepository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId()).stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BusinessException("JÃ¡ existe um usuÃ¡rio com este e-mail");
        }

        var companyId = currentUser.companyId();

        var user = new User();
        user.setCompanyId(companyId);
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRoles(resolveRoles(companyId, request.roles(), Set.of("VENDEDOR")));
        user.setActive(true);

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        var companyId = currentUser.companyId();
        var user = userRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new NotFoundException("UsuÃ¡rio nÃ£o encontrado"));

        if (id.equals(currentUser.userId()) && !request.active()) {
            throw new BusinessException("VocÃª nÃ£o pode desativar o prÃ³prio usuÃ¡rio");
        }

        user.setName(request.name());
        user.setActive(request.active());
        user.setRoles(resolveRoles(companyId, request.roles(), user.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet())));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Long id, String password) {
        var user = userRepository.findByIdAndCompanyId(id, currentUser.companyId())
                .orElseThrow(() -> new NotFoundException("UsuÃ¡rio nÃ£o encontrado"));
        user.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    private Set<Role> resolveRoles(Long companyId, Set<String> requestedRoles, Set<String> fallback) {
        Set<String> names = requestedRoles == null || requestedRoles.isEmpty() ? fallback : requestedRoles;
        Set<Role> roles = new HashSet<>();

        for (String roleName : names) {
            roles.add(roleRepository.findByCompanyIdAndName(companyId, roleName.toUpperCase())
                    .orElseThrow(() -> new BusinessException("Perfil inexistente: " + roleName)));
        }

        return roles;
    }
}
