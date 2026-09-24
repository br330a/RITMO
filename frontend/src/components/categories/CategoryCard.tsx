import {
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router'
import {
  categoryColorStyles,
  categoryProgressStyles,
} from '../../constants/categoryStyles'
import { categoryIcons } from '../../constants/categoryIcons'
import type {
  Category,
} from '../../types/categoryTypes'
import type {
  Task,
} from '../../types/taskTypes'

type CategoryCardProps = {
  category: Category
  tasks: Task[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({
  category,
  tasks,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const Icon =
    categoryIcons[category.icon]

  const categoryTasks = tasks.filter(
    (task) =>
      task.categoryId === category.id,
  )

  const completedTasks =
    categoryTasks.filter(
      (task) => task.completed,
    ).length

  const pendingTasks =
    categoryTasks.length -
    completedTasks

  const progress = categoryTasks.length
    ? Math.round(
        (completedTasks /
          categoryTasks.length) *
          100,
      )
    : 0

  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div
          className={[
            'grid size-12 place-items-center rounded-xl',
            categoryColorStyles[
              category.color
            ],
          ].join(' ')}
        >
          <Icon
            size={23}
            strokeWidth={1.8}
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              onEdit(category)
            }
            aria-label={`Editar ${category.name}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#8a938d] transition-colors hover:bg-[#e4f3e8] hover:text-[#19683a]"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(category)
            }
            aria-label={`Excluir ${category.name}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#8a938d] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="break-words text-xl font-semibold text-[#17211b]">
            {category.name}
          </h2>

          <p className="mt-1 text-sm text-[#7b847e]">
            {pendingTasks === 1
              ? '1 tarefa pendente'
              : `${pendingTasks} tarefas pendentes`}
          </p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-[#8a938d]">
          {categoryTasks.length}{' '}
          {categoryTasks.length === 1
            ? 'tarefa'
            : 'tarefas'}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-[#8a938d]">
            Progresso
          </span>

          <span className="font-semibold text-[#27312b]">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#e7ece8]">
          <div
            className={[
              'h-full rounded-full transition-all',
              categoryProgressStyles[
                category.color
              ],
            ].join(' ')}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <Link
        to="/tarefas"
        className="mt-6 flex items-center justify-between border-t border-[#edf1ed] pt-4 text-sm font-semibold text-[#19683a] hover:underline"
      >
        Ver tarefas
        <ArrowRight size={17} />
      </Link>
    </article>
  )
}