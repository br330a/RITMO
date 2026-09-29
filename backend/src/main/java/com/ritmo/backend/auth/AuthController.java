package com.ritmo.backend.auth;

import com.ritmo.backend.auth.dto.RegisterUserRequest;
import com.ritmo.backend.auth.dto.UserResponse;
import com.ritmo.backend.user.UserService;
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

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterUserRequest request
    ) {
        UserResponse user = userService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }
}