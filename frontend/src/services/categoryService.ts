import { apiRequest } from './apiClient'
import type {
  Category,
  CreateCategoryData,
} from '../types/categoryTypes'

export function getCategories(token: string) {
  return apiRequest<Category[]>(
    '/api/categories',
    {
      token,
    },
  )
}

export function createCategoryRequest(
  token: string,
  categoryData: CreateCategoryData,
) {
  return apiRequest<Category>(
    '/api/categories',
    {
      method: 'POST',
      token,
      body: categoryData,
    },
  )
}

export function updateCategoryRequest(
  token: string,
  categoryId: string,
  categoryData: CreateCategoryData,
) {
  return apiRequest<Category>(
    `/api/categories/${categoryId}`,
    {
      method: 'PUT',
      token,
      body: categoryData,
    },
  )
}

export function deleteCategoryRequest(
  token: string,
  categoryId: string,
) {
  return apiRequest<void>(
    `/api/categories/${categoryId}`,
    {
      method: 'DELETE',
      token,
    },
  )
}