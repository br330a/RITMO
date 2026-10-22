package com.ritmo.backend.auth;

import com.ritmo.backend.auth.dto.AuthResponse;
import com.ritmo.backend.auth.dto.LoginRequest;
import com.ritmo.backend.auth.dto.RegisterUserRequest;
import com.ritmo.backend.auth.dto.UserResponse;
import com.ritmo.backend.auth.jwt.JwtService;
import com.ritmo.backend.user.User;
import com.ritmo.backend.user.UserRepository;
import com.ritmo.backend.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse registerUser(RegisterUserRequest request) {
        return userService.register(request);
    }

    public AuthResponse register(RegisterUserRequest request) {
        // A conta é persistida antes de emitir o JWT, sem um segundo login HTTP.
        UserResponse newUser = userService.register(request);
        return createAuthResponse(newUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha inválidos."
                ));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "E-mail ou senha inválidos."
            );
        }

        String theme = user.getTheme() == null ? "light" : user.getTheme();
        String accentColor = user.getAccentColor() == null ? "green" : user.getAccentColor();

        return createAuthResponse(new UserResponse(
                user.getId(), user.getName(), user.getEmail(),
                theme, accentColor, user.getCreatedAt()
        ));
    }

    private AuthResponse createAuthResponse(UserResponse user) {
        String token = jwtService.generateToken(
                user.id(), user.email(), user.name()
        );

        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                user
        );
    }
}
