import {
  useState,
} from 'react'
import {
  Plus,
  Tags,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  CategoryCard,
} from '../components/categories/CategoryCard'
import {
  CategoryFormModal,
} from '../components/categories/CategoryFormModal'
import {
  useCategories,
} from '../hooks/useCategories'
import {
  useTasks,
} from '../hooks/useTasks'
import type {
  Category,
} from '../types/categoryTypes'

export function CategoriesPage() {
  const { tasks } =
    useTasks()

  const {
    categories,
    isLoadingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories()

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false)

  const [
    categoryToEdit,
    setCategoryToEdit,
  ] =
    useState<Category | null>(
      null,
    )

  const [
    categoryToDelete,
    setCategoryToDelete,
  ] =
    useState<Category | null>(
      null,
    )

  const completedTasks =
    tasks.filter(
      (task) =>
        task.completed,
    ).length

  function requestCategoryDeletion(
    category: Category,
  ) {
    const categoryHasTasks =
      tasks.some(
        (task) =>
          task.categoryId ===
          category.id,
      )

    if (categoryHasTasks) {
      toast.error(
        'Essa categoria ainda possui tarefas. Mova ou exclua essas tarefas antes de apagar a categoria.',
      )
      return
    }

    setCategoryToDelete(
      category,
    )
  }

  if (
    isLoadingCategories
  ) {
    return (
      <section className="mx-auto max-w-[1200px]">
        <div className="grid min-h-64 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
          <div className="text-center">
            <div className="mx-auto size-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />

            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Carregando categorias...
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px]">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Categorias
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Organize as áreas da sua rotina do seu jeito.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsCreateModalOpen(
                true,
              )
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Plus size={19} />
            Nova categoria
          </button>
        </header>

        <div className="mt-8 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-sm">
          <p className="text-sm text-[var(--text-muted)]">
            Visão geral
          </p>

          <div className="mt-4 flex flex-wrap gap-8">
            <div>
              <strong className="block text-2xl text-[var(--text-primary)]">
                {
                  categories.length
                }
              </strong>

              <span className="text-sm text-[var(--text-muted)]">
                Categorias
              </span>
            </div>

            <div>
              <strong className="block text-2xl text-[var(--text-primary)]">
                {tasks.length}
              </strong>

              <span className="text-sm text-[var(--text-muted)]">
                Total de tarefas
              </span>
            </div>

            <div>
              <strong className="block text-2xl text-[var(--primary)]">
                {
                  completedTasks
                }
              </strong>

              <span className="text-sm text-[var(--text-muted)]">
                Concluídas
              </span>
            </div>

            <div>
              <strong className="block text-2xl text-amber-500">
                {tasks.length -
                  completedTasks}
              </strong>

              <span className="text-sm text-[var(--text-muted)]">
                Pendentes
              </span>
            </div>
          </div>
        </div>

        {categories.length ===
        0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <Tags
              size={32}
              className="mx-auto text-[var(--text-faint)]"
            />

            <p className="mt-4 font-medium text-[var(--text-strong)]">
              Nenhuma categoria criada
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Crie categorias para organizar suas tarefas por áreas da rotina.
            </p>

            <button
              type="button"
              onClick={() =>
                setIsCreateModalOpen(
                  true,
                )
              }
              className="mt-5 cursor-pointer rounded-xl bg-[var(--primary-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-strong)] hover:bg-[var(--primary-soft-hover)]"
            >
              Criar categoria
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(
              (category) => (
                <CategoryCard
                  key={
                    category.id
                  }
                  category={
                    category
                  }
                  tasks={tasks}
                  onEdit={
                    setCategoryToEdit
                  }
                  onDelete={
                    requestCategoryDeletion
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <CategoryFormModal
          onClose={() =>
            setIsCreateModalOpen(
              false,
            )
          }
          onSubmit={
            createCategory
          }
        />
      )}

      {categoryToEdit && (
        <CategoryFormModal
          key={
            categoryToEdit.id
          }
          category={
            categoryToEdit
          }
          onClose={() =>
            setCategoryToEdit(
              null,
            )
          }
          onSubmit={(
            categoryData,
          ) =>
            updateCategory(
              categoryToEdit.id,
              categoryData,
            )
          }
        />
      )}

      {categoryToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={() =>
            setCategoryToDelete(
              null,
            )
          }
          className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-5"
        >
          <section
            onMouseDown={(
              event,
            ) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-7 shadow-xl"
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  Excluir categoria?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  A categoria{' '}
                  <strong>
                    {
                      categoryToDelete.name
                    }
                  </strong>{' '}
                  será removida permanentemente.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCategoryToDelete(
                    null,
                  )
                }
                aria-label="Fechar"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              >
                <X size={19} />
              </button>
            </header>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setCategoryToDelete(
                    null,
                  )
                }
                className="cursor-pointer rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={async () => {
                  const success =
                    await deleteCategory(
                      categoryToDelete.id,
                    )

                  if (success) {
                    setCategoryToDelete(
                      null,
                    )
                  }
                }}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Excluir categoria
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}