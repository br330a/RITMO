import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { toast } from 'sonner'
import {
  CategoriesContext,
  type CategoriesContextValue,
} from '../context/categoriesContext'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/apiClient'
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategories,
  updateCategoryRequest,
} from '../services/categoryService'
import type {
  Category,
  CreateCategoryData,
} from '../types/categoryTypes'

type CategoriesState = {
  ownerToken: string | null
  categories: Category[]
  status: 'idle' | 'ready' | 'error'
}

function sortCategories(
  categories: Category[],
) {
  return [...categories].sort(
    (firstCategory, secondCategory) =>
      firstCategory.name.localeCompare(
        secondCategory.name,
        'pt-BR',
      ),
  )
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof ApiError) {
    return (
      error.payload?.message ??
      fallbackMessage
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export function CategoriesProvider({
  children,
}: PropsWithChildren) {
  const { token } = useAuth()

  const [state, setState] =
    useState<CategoriesState>({
      ownerToken: null,
      categories: [],
      status: 'idle',
    })

  const categories =
    token && state.ownerToken === token
      ? state.categories
      : []

  const isLoadingCategories =
    Boolean(token) &&
    state.ownerToken !== token

  useEffect(() => {
    if (!token) {
      return
    }

    let isActive = true

    getCategories(token)
      .then((loadedCategories) => {
        if (!isActive) {
          return
        }

        setState({
          ownerToken: token,
          categories:
            sortCategories(
              loadedCategories,
            ),
          status: 'ready',
        })
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setState({
          ownerToken: token,
          categories: [],
          status: 'error',
        })

        toast.error(
          getErrorMessage(
            error,
            'Não foi possível carregar as categorias.',
          ),
        )
      })

    return () => {
      isActive = false
    }
  }, [token])

  async function createCategory(
    categoryData: CreateCategoryData,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )
      return false
    }

    try {
      const newCategory =
        await createCategoryRequest(
          token,
          categoryData,
        )

      setState((currentState) => ({
        ownerToken: token,
        categories: sortCategories(
          currentState.ownerToken === token
            ? [
                ...currentState.categories,
                newCategory,
              ]
            : [newCategory],
        ),
        status: 'ready',
      }))

      toast.success(
        'Categoria criada com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível criar a categoria.',
        ),
      )

      return false
    }
  }

  async function updateCategory(
    categoryId: string,
    categoryData: CreateCategoryData,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )
      return false
    }

    try {
      const updatedCategory =
        await updateCategoryRequest(
          token,
          categoryId,
          categoryData,
        )

      setState((currentState) => ({
        ownerToken: token,
        categories: sortCategories(
          currentState.ownerToken === token
            ? currentState.categories.map(
                (category) =>
                  category.id === categoryId
                    ? updatedCategory
                    : category,
              )
            : [updatedCategory],
        ),
        status: 'ready',
      }))

      toast.success(
        'Categoria atualizada com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível atualizar a categoria.',
        ),
      )

      return false
    }
  }

  async function deleteCategory(
    categoryId: string,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )
      return false
    }

    try {
      await deleteCategoryRequest(
        token,
        categoryId,
      )

      setState((currentState) => ({
        ownerToken: token,
        categories:
          currentState.ownerToken === token
            ? currentState.categories.filter(
                (category) =>
                  category.id !== categoryId,
              )
            : [],
        status: 'ready',
      }))

      toast.success(
        'Categoria excluída com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível excluir a categoria.',
        ),
      )

      return false
    }
  }

  const contextValue: CategoriesContextValue = {
    categories,
    isLoadingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    }

  return (
    <CategoriesContext.Provider
      value={contextValue}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
