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
import { initialCategories } from '../data/initialCategories'
import {
    loadCategories,
    saveCategories,
} from '../services/categoryStorage'
import type {
    Category,
    CreateCategoryData,
} from '../types/categoryTypes'

function normalizeCategoryName(
    name: string,
) {
    return name
        .trim()
        .toLocaleLowerCase('pt-BR')
}

export function CategoriesProvider({
    children,
}: PropsWithChildren) {
    const [categories, setCategories] =
        useState<Category[]>(
            () =>
                loadCategories() ??
                initialCategories,
        )

    useEffect(() => {
        saveCategories(categories)
    }, [categories])

    function createCategory(
        categoryData: CreateCategoryData,
    ) {
        const normalizedName =
            normalizeCategoryName(
                categoryData.name,
            )

        const categoryAlreadyExists =
            categories.some(
                (category) =>
                    normalizeCategoryName(
                        category.name,
                    ) === normalizedName,
            )

        if (categoryAlreadyExists) {
            toast.error(
                'Já existe uma categoria com esse nome.',
            )

            return false
        }

        const newCategory: Category = {
            ...categoryData,
            id: crypto.randomUUID(),
            name: categoryData.name.trim(),
        }

        setCategories(
            (currentCategories) => [
                ...currentCategories,
                newCategory,
            ],
        )

        toast.success(
            'Categoria criada com sucesso.',
        )

        return true
    }

    function updateCategory(
        categoryId: string,
        categoryData: CreateCategoryData,
    ) {
        const normalizedName =
            normalizeCategoryName(
                categoryData.name,
            )

        const categoryAlreadyExists =
            categories.some(
                (category) =>
                    category.id !== categoryId &&
                    normalizeCategoryName(
                        category.name,
                    ) === normalizedName,
            )

        if (categoryAlreadyExists) {
            toast.error(
                'Já existe uma categoria com esse nome.',
            )

            return false
        }

        setCategories(
            (currentCategories) =>
                currentCategories.map(
                    (category) =>
                        category.id === categoryId
                            ? {
                                ...category,
                                ...categoryData,
                                name:
                                    categoryData.name.trim(),
                            }
                            : category,
                ),
        )

        toast.success(
            'Categoria atualizada com sucesso.',
        )

        return true
    }

    function deleteCategory(
        categoryId: string,
    ) {
        setCategories(
            (currentCategories) =>
                currentCategories.filter(
                    (category) =>
                        category.id !== categoryId,
                ),
        )

        toast.success(
            'Categoria excluída com sucesso.',
        )
    }

    const contextValue: CategoriesContextValue =
    {
        categories,
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