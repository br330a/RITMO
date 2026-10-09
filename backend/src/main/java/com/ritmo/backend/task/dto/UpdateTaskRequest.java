package com.ritmo.backend.task.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateTaskRequest(

        @NotBlank
        @Size(max = 120)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull
        LocalDate dueDate,

        @Pattern(
                regexp = "^([01]\\d|2[0-3]):[0-5]\\d$",
                message = "Horário inválido."
        )
        String time,

        @NotNull
        UUID categoryId,

        @NotBlank
        @Pattern(regexp = "low|medium|high")
        String priority,

        @Positive
        Integer estimatedMinutes,

        @Valid
        TaskRecurrenceRequest recurrence

) {
}