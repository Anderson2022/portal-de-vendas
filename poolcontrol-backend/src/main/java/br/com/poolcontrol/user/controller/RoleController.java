package br.com.poolcontrol.user.controller;
import br.com.poolcontrol.user.entity.User;



import br.com.poolcontrol.shared.security.CurrentUserService;
import br.com.poolcontrol.user.dto.RoleResponse;
import br.com.poolcontrol.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository repository;
    private final CurrentUserService currentUser;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_USER_VIEW')")
    public List<RoleResponse> list() {
        return repository.findAllByCompanyIdOrderByNameAsc(currentUser.companyId())
                .stream()
                .map(RoleResponse::from)
                .toList();
    }
}
