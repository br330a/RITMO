package com.ritmo.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateAccentColorRequest(

        @NotBlank
        @Pattern(
                regexp = "green|blue|pink|amber|purple",
                message = "Cor inválida."
        )
        String accentColor

) {
}