package com.ritmo.backend.auth;

import com.ritmo.backend.auth.dto.AuthResponse;
import com.ritmo.backend.auth.dto.LoginRequest;
import com.ritmo.backend.auth.dto.RegisterUserRequest;
import com.ritmo.backend.auth.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Rota original preservada para clientes que esperam apenas o usuário.
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterUserRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.registerUser(request));
    }

    // Cadastro e autenticação em uma única requisição.
    @PostMapping("/register-session")
    public ResponseEntity<AuthResponse> registerSession(
            @Valid @RequestBody RegisterUserRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }
}
