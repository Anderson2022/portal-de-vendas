package br.com.poolcontrol.user.controller;
import br.com.poolcontrol.user.entity.User;



import br.com.poolcontrol.user.dto.UserCreateRequest;
import br.com.poolcontrol.user.dto.UserPasswordRequest;
import br.com.poolcontrol.user.service.UserAdminService;
import br.com.poolcontrol.user.dto.UserResponse;
import br.com.poolcontrol.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserAdminService service;

    @GetMapping
    @PreAuthorize("hasAuthority('PERM_USER_VIEW')")
    public List<UserResponse> list() {
        return service.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('PERM_USER_CREATE')")
    public UserResponse create(@Valid @RequestBody UserCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERM_USER_CREATE')")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return service.update(id, request);
    }

    @PutMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('PERM_USER_CREATE')")
    public void changePassword(@PathVariable Long id, @Valid @RequestBody UserPasswordRequest request) {
        service.changePassword(id, request.password());
    }
}
