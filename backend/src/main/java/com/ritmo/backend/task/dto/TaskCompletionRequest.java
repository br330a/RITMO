package com.ritmo.backend.task.dto;

import jakarta.validation.constraints.NotNull;

public record TaskCompletionRequest(

        @NotNull
        Boolean completed

) {
}