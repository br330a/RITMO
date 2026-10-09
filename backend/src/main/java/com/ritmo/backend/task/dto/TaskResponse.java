package com.ritmo.backend.task.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

public record TaskResponse(
        UUID id,
        String title,
        String description,
        LocalDate dueDate,
        String time,
        UUID categoryId,
        String priority,
        Integer estimatedMinutes,
        TaskRecurrenceResponse recurrence,
        Map<String, String> completedOccurrences,
        boolean completed,
        Instant completedAt
) {
}