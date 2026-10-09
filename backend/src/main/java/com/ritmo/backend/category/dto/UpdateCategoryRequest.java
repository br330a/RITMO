package com.ritmo.backend.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(

        @NotBlank
        @Size(max = 30)
        String name,

        @NotBlank
        @Pattern(
                regexp = "green|blue|purple|orange|red|teal",
                message = "Cor inválida."
        )
        String color,

        @NotBlank
        @Pattern(
                regexp = "graduation|user|health|work|finance|study|home|other",
                message = "Ícone inválido."
        )
        String icon

) {
}