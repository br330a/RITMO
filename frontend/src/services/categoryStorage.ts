import type { Category } from '../types/categoryTypes'

const CATEGORIES_STORAGE_KEY =
    'ritmo:categories'

export function loadCategories():
    | Category[]
    | null {
    const storedCategories =
        localStorage.getItem(
            CATEGORIES_STORAGE_KEY,
        )

    if (!storedCategories) {
        return null
    }

    try {
        const parsedCategories =
            JSON.parse(storedCategories)

        if (!Array.isArray(parsedCategories)) {
            return null
        }

        return parsedCategories as Category[]
    } catch {
        return null
    }
}

export function saveCategories(
    categories: Category[],
) {
    localStorage.setItem(
        CATEGORIES_STORAGE_KEY,
        JSON.stringify(categories),
    )
}