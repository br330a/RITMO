package com.ritmo.backend.category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findAllByUserIdOrderByNameAsc(Long userId);

    Optional<Category> findByIdAndUserId(UUID id, Long userId);

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);

    boolean existsByUserIdAndNameIgnoreCaseAndIdNot(
            Long userId,
            String name,
            UUID id
    );
}