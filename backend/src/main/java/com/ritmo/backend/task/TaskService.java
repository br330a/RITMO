package com.ritmo.backend.task;

import com.ritmo.backend.category.Category;
import com.ritmo.backend.category.CategoryRepository;
import com.ritmo.backend.task.dto.CreateTaskRequest;
import com.ritmo.backend.task.dto.TaskRecurrenceRequest;
import com.ritmo.backend.task.dto.TaskRecurrenceResponse;
import com.ritmo.backend.task.dto.TaskResponse;
import com.ritmo.backend.task.dto.UpdateTaskRequest;
import com.ritmo.backend.user.User;
import com.ritmo.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class TaskService {

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("HH:mm");

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAllByUserId(Long userId) {
        return taskRepository
                .findAllByUserIdOrderByDueDateAscTimeAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long userId, UUID taskId) {
        return toResponse(findTask(userId, taskId));
    }

    @Transactional
    public TaskResponse create(
            Long userId,
            CreateTaskRequest request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado."
                ));

        Category category = findCategory(
                userId,
                request.categoryId()
        );

        Task task = new Task(
                request.title().trim(),
                normalizeDescription(request.description()),
                request.dueDate(),
                parseTime(request.time()),
                parsePriority(request.priority()),
                request.estimatedMinutes(),
                category,
                user
        );

        task.setSticker(
                parseSticker(request.sticker())
        );

        applyRecurrence(
                task,
                request.recurrence()
        );

        return toResponse(
                taskRepository.save(task)
        );
    }

    @Transactional
    public TaskResponse update(
            Long userId,
            UUID taskId,
            UpdateTaskRequest request
    ) {
        Task task =
                findTask(userId, taskId);

        Category category =
                findCategory(
                        userId,
                        request.categoryId()
                );

        task.setTitle(
                request.title().trim()
        );

        task.setDescription(
                normalizeDescription(
                        request.description()
                )
        );

        task.setDueDate(
                request.dueDate()
        );

        task.setTime(
                parseTime(request.time())
        );

        task.setPriority(
                parsePriority(
                        request.priority()
                )
        );

        task.setEstimatedMinutes(
                request.estimatedMinutes()
        );

        task.setSticker(
                parseSticker(
                        request.sticker()
                )
        );

        task.setCategory(category);

        applyRecurrence(
                task,
                request.recurrence()
        );

        return toResponse(task);
    }

    @Transactional
    public void delete(
            Long userId,
            UUID taskId
    ) {
        Task task =
                findTask(
                        userId,
                        taskId
                );

        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse setCompletion(
            Long userId,
            UUID taskId,
            boolean completed
    ) {
        Task task =
                findTask(
                        userId,
                        taskId
                );

        if (
                task.getRecurrenceFrequency()
                        != null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tarefas recorrentes devem ser concluídas por ocorrência."
            );
        }

        task.setCompleted(completed);

        task.setCompletedAt(
                completed
                        ? Instant.now()
                        : null
        );

        return toResponse(task);
    }

    @Transactional
    public TaskResponse completeOccurrence(
            Long userId,
            UUID taskId,
            LocalDate date
    ) {
        Task task =
                findTask(
                        userId,
                        taskId
                );

        validateOccurrence(
                task,
                date
        );

        task.getCompletedOccurrences()
                .putIfAbsent(
                        date,
                        Instant.now()
                );

        return toResponse(task);
    }

    @Transactional
    public TaskResponse uncompleteOccurrence(
            Long userId,
            UUID taskId,
            LocalDate date
    ) {
        Task task =
                findTask(
                        userId,
                        taskId
                );

        validateOccurrence(
                task,
                date
        );

        task.getCompletedOccurrences()
                .remove(date);

        return toResponse(task);
    }

    private Task findTask(
            Long userId,
            UUID taskId
    ) {
        return taskRepository
                .findByIdAndUserId(
                        taskId,
                        userId
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Tarefa não encontrada."
                        )
                );
    }

    private Category findCategory(
            Long userId,
            UUID categoryId
    ) {
        return categoryRepository
                .findByIdAndUserId(
                        categoryId,
                        userId
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria não encontrada."
                        )
                );
    }

    private void applyRecurrence(
            Task task,
            TaskRecurrenceRequest recurrence
    ) {
        if (recurrence == null) {
            task.setRecurrenceFrequency(
                    null
            );

            task.setRecurrenceDaysOfWeek(
                    Set.of()
            );

            task.setRecurrenceEndDate(
                    null
            );

            task.getCompletedOccurrences()
                    .clear();

            return;
        }

        RecurrenceFrequency frequency =
                RecurrenceFrequency.valueOf(
                        recurrence
                                .frequency()
                                .toUpperCase(
                                        Locale.ROOT
                                )
                );

        if (
                recurrence.endDate() != null
                        && recurrence
                        .endDate()
                        .isBefore(
                                task.getDueDate()
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A data final da recorrência não pode ser anterior à data inicial."
            );
        }

        Set<Integer> days =
                recurrence.daysOfWeek()
                                == null
                        ? Set.of()
                        : new HashSet<>(
                                recurrence
                                        .daysOfWeek()
                        );

        if (
                frequency
                        == RecurrenceFrequency.WEEKLY
                        && days.isEmpty()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Recorrência semanal precisa de pelo menos um dia da semana."
            );
        }

        if (
                frequency
                        != RecurrenceFrequency.WEEKLY
                        && !days.isEmpty()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dias da semana só podem ser usados em recorrência semanal."
            );
        }

        task.setCompleted(false);
        task.setCompletedAt(null);

        task.setRecurrenceFrequency(
                frequency
        );

        task.setRecurrenceDaysOfWeek(
                days
        );

        task.setRecurrenceEndDate(
                recurrence.endDate()
        );
    }

    private void validateOccurrence(
            Task task,
            LocalDate date
    ) {
        if (
                task.getRecurrenceFrequency()
                        == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Esta tarefa não é recorrente."
            );
        }

        if (
                !occursOnDate(
                        task,
                        date
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A tarefa não possui ocorrência nessa data."
            );
        }
    }

    private boolean occursOnDate(
            Task task,
            LocalDate date
    ) {
        if (
                date.isBefore(
                        task.getDueDate()
                )
        ) {
            return false;
        }

        if (
                task.getRecurrenceEndDate()
                        != null
                        && date.isAfter(
                                task.getRecurrenceEndDate()
                        )
        ) {
            return false;
        }

        return switch (
                task.getRecurrenceFrequency()
        ) {
            case DAILY -> true;

            case WEEKLY -> {
                int dayOfWeek =
                        date.getDayOfWeek()
                                .getValue()
                                % 7;

                yield task
                        .getRecurrenceDaysOfWeek()
                        .contains(dayOfWeek);
            }

            case MONTHLY ->
                    date.getDayOfMonth()
                            == task
                            .getDueDate()
                            .getDayOfMonth();
        };
    }

    private TaskPriority parsePriority(
            String priority
    ) {
        return TaskPriority.valueOf(
                priority.toUpperCase(
                        Locale.ROOT
                )
        );
    }

    private TaskSticker parseSticker(
            String sticker
    ) {
        if (
                sticker == null
                        || sticker.isBlank()
        ) {
            return null;
        }

        return TaskSticker.valueOf(
                sticker.toUpperCase(
                        Locale.ROOT
                )
        );
    }

    private LocalTime parseTime(
            String time
    ) {
        if (
                time == null
                        || time.isBlank()
        ) {
            return null;
        }

        return LocalTime.parse(time);
    }

    private String normalizeDescription(
            String description
    ) {
        if (
                description == null
                        || description.isBlank()
        ) {
            return null;
        }

        return description.trim();
    }

    private TaskResponse toResponse(
            Task task
    ) {
        TaskRecurrenceResponse recurrence =
                null;

        if (
                task.getRecurrenceFrequency()
                        != null
        ) {
            recurrence =
                    new TaskRecurrenceResponse(
                            task
                                    .getRecurrenceFrequency()
                                    .name()
                                    .toLowerCase(
                                            Locale.ROOT
                                    ),
                            task
                                    .getRecurrenceDaysOfWeek()
                                    .stream()
                                    .sorted()
                                    .toList(),
                            task
                                    .getRecurrenceEndDate()
                    );
        }

        Map<String, String>
                completedOccurrences =
                new LinkedHashMap<>();

        task.getCompletedOccurrences()
                .entrySet()
                .stream()
                .sorted(
                        Map.Entry
                                .comparingByKey()
                )
                .forEach(entry ->
                        completedOccurrences.put(
                                entry
                                        .getKey()
                                        .toString(),
                                entry
                                        .getValue()
                                        .toString()
                        )
                );

        String sticker =
                task.getSticker() == null
                        ? null
                        : task
                        .getSticker()
                        .name()
                        .toLowerCase(
                                Locale.ROOT
                        );

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getTime() == null
                        ? null
                        : task
                        .getTime()
                        .format(
                                TIME_FORMATTER
                        ),
                task.getCategory().getId(),
                task.getPriority()
                        .name()
                        .toLowerCase(
                                Locale.ROOT
                        ),
                task.getEstimatedMinutes(),
                sticker,
                recurrence,
                completedOccurrences,
                task.isCompleted(),
                task.getCompletedAt()
        );
    }
}