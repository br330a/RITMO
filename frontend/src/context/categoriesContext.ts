import { createContext } from 'react'
import type {
  Category,
  CreateCategoryData,
} from '../types/categoryTypes'

export type CategoriesContextValue = {
  categories: Category[]
  isLoadingCategories: boolean

  createCategory: (
    categoryData: CreateCategoryData,
  ) => Promise<boolean>

  updateCategory: (
    categoryId: string,
    categoryData: CreateCategoryData,
  ) => Promise<boolean>

  deleteCategory: (
    categoryId: string,
  ) => Promise<boolean>
}

export const CategoriesContext =
  createContext<
    CategoriesContextValue | undefined
  >(undefined)