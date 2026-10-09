package com.ritmo.backend.task.dto;

import java.time.LocalDate;
import java.util.List;

public record TaskRecurrenceResponse(
        String frequency,
        List<Integer> daysOfWeek,
        LocalDate endDate
) {
}