package br.com.poolcontrol.auth.controller;

import br.com.poolcontrol.auth.dto.LoginRequest;
import br.com.poolcontrol.auth.dto.LoginResponse;

import br.com.poolcontrol.auth.service.AuthService;
import br.com.poolcontrol.shared.security.CurrentUser;
import br.com.poolcontrol.shared.security.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUser> me() {
        return ResponseEntity.ok(currentUserService.get());
    }
}
