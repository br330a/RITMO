import type {
    Category,
} from '../types/categoryTypes'

export function getCategoryById(
    categories: Category[],
    categoryId: string,
) {
    return (
        categories.find(
            (category) =>
                category.id === categoryId,
        ) ?? null
    )
}