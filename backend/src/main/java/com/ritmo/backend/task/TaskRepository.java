package com.ritmo.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findAllByUserIdOrderByDueDateAscTimeAsc(Long userId);

    Optional<Task> findByIdAndUserId(UUID id, Long userId);

    boolean existsByCategoryIdAndUserId(UUID categoryId, Long userId);
}