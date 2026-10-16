package com.ritmo.backend.auth.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String name,
        String email,
        String theme,
        Instant createdAt
) {
}