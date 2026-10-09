package com.ritmo.backend.category;

import com.ritmo.backend.category.dto.CategoryResponse;
import com.ritmo.backend.category.dto.CreateCategoryRequest;
import com.ritmo.backend.category.dto.UpdateCategoryRequest;
import com.ritmo.backend.user.User;
import com.ritmo.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllByUserId(Long userId) {
        return categoryRepository
                .findAllByUserIdOrderByNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(
            Long userId,
            CreateCategoryRequest request
    ) {
        String name = request.name().trim();

        if (categoryRepository.existsByUserIdAndNameIgnoreCase(userId, name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Você já possui uma categoria com esse nome."
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado."
                ));

        Category category = new Category(
                name,
                request.color(),
                request.icon(),
                user
        );

        Category savedCategory = categoryRepository.save(category);

        return toResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse update(
            Long userId,
            UUID categoryId,
            UpdateCategoryRequest request
    ) {
        Category category = categoryRepository
                .findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria não encontrada."
                ));

        String name = request.name().trim();

        if (categoryRepository.existsByUserIdAndNameIgnoreCaseAndIdNot(
                userId,
                name,
                categoryId
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Você já possui uma categoria com esse nome."
            );
        }

        category.setName(name);
        category.setColor(request.color());
        category.setIcon(request.icon());

        return toResponse(category);
    }

    @Transactional
    public void delete(Long userId, UUID categoryId) {
        Category category = categoryRepository
                .findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria não encontrada."
                ));

        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor(),
                category.getIcon(),
                category.getCreatedAt()
        );
    }
}