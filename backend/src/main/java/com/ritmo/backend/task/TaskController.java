package com.ritmo.backend.task;

import com.ritmo.backend.task.dto.CreateTaskRequest;
import com.ritmo.backend.task.dto.TaskCompletionRequest;
import com.ritmo.backend.task.dto.TaskResponse;
import com.ritmo.backend.task.dto.UpdateTaskRequest;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> findAll(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.findAllByUserId(userId);
    }

    @GetMapping("/{id}")
    public TaskResponse findById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.findById(userId, id);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateTaskRequest request
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(taskService.create(userId, request));
    }

    @PutMapping("/{id}")
    public TaskResponse update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.update(userId, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        taskService.delete(userId, id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/completion")
    public TaskResponse setCompletion(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody TaskCompletionRequest request
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.setCompletion(
                userId,
                id,
                request.completed()
        );
    }

    @PostMapping("/{id}/occurrences/{date}/complete")
    public TaskResponse completeOccurrence(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.completeOccurrence(
                userId,
                id,
                date
        );
    }

    @DeleteMapping("/{id}/occurrences/{date}/complete")
    public TaskResponse uncompleteOccurrence(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return taskService.uncompleteOccurrence(
                userId,
                id,
                date
        );
    }
}