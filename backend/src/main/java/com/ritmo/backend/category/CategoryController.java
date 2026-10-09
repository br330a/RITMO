package com.ritmo.backend.category;

import com.ritmo.backend.category.dto.CategoryResponse;
import com.ritmo.backend.category.dto.CreateCategoryRequest;
import com.ritmo.backend.category.dto.UpdateCategoryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> findAll(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return categoryService.findAllByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        CategoryResponse category = categoryService.create(
                userId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                categoryService.update(userId, id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id
    ) {
        Long userId = Long.valueOf(jwt.getSubject());

        categoryService.delete(userId, id);

        return ResponseEntity.noContent().build();
    }
}