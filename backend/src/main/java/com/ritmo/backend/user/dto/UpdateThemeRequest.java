package com.ritmo.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateThemeRequest(

        @NotBlank
        @Pattern(
                regexp = "light|dark",
                message = "Tema inválido."
        )
        String theme

) {
}