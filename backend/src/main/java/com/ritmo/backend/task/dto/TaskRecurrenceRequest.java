package com.ritmo.backend.task.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.List;

public record TaskRecurrenceRequest(

        @NotBlank
        @Pattern(regexp = "daily|weekly|monthly")
        String frequency,

        List<
                @Min(0)
                @Max(6)
                Integer
                > daysOfWeek,

        LocalDate endDate

) {
}