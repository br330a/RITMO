import { createContext } from 'react'
import type {
    Category,
    CreateCategoryData,
} from '../types/categoryTypes'

export type CategoriesContextValue = {
    categories: Category[]

    createCategory: (
        categoryData: CreateCategoryData,
    ) => boolean

    updateCategory: (
        categoryId: string,
        categoryData: CreateCategoryData,
    ) => boolean

    deleteCategory: (
        categoryId: string,
    ) => void
}

export const CategoriesContext =
    createContext<
        CategoriesContextValue | undefined
    >(undefined)