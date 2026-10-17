package com.ritmo.backend.user;

import com.ritmo.backend.auth.dto.UserResponse;
import com.ritmo.backend.user.dto.UpdateAccentColorRequest;
import com.ritmo.backend.user.dto.UpdateThemeRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId =
                Long.valueOf(jwt.getSubject());

        return userService.findById(userId);
    }

    @PatchMapping("/me/theme")
    public UserResponse updateTheme(
            @AuthenticationPrincipal Jwt jwt,
            @Valid
            @RequestBody UpdateThemeRequest request
    ) {
        Long userId =
                Long.valueOf(jwt.getSubject());

        return userService.updateTheme(
                userId,
                request
        );
    }

    @PatchMapping("/me/accent-color")
    public UserResponse updateAccentColor(
            @AuthenticationPrincipal Jwt jwt,
            @Valid
            @RequestBody UpdateAccentColorRequest request
    ) {
        Long userId =
                Long.valueOf(jwt.getSubject());

        return userService.updateAccentColor(
                userId,
                request
        );
    }
}