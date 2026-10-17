import {
  CalendarDays,
  Check,
  Clock3,
  Flag,
  Pencil,
  Timer,
  Trash2,
} from 'lucide-react'
import { categoryColorStyles } from '../../constants/categoryStyles'
import { useCategories } from '../../hooks/useCategories'
import { getCategoryById } from '../../utils/categoryUtils'
import {
  priorityLabels,
  priorityStyles,
} from '../../constants/taskStyles'
import type { Task } from '../../types/taskTypes'
import { formatTaskDate } from '../../utils/date'
import { formatEstimatedMinutes } from '../../utils/taskFormatters'
import {
  getTaskSticker,
} from '../../constants/taskStickers'

type TaskCardProps = {
  task: Task
  onToggle: (
    taskId: string,
    occurrenceDate?: string,
  ) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onOpen: (task: Task) => void
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onOpen,
}: TaskCardProps) {
  const { categories } = useCategories()

  const category = getCategoryById(
    categories,
    task.categoryId,
  )

  const sticker =
    getTaskSticker(
      task.sticker,
    )
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return
        }

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()
          onOpen(task)
        }
      }}
      className="min-w-0 cursor-pointer rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-sm transition-all hover:border-[var(--border)] hover:shadow-md"
    >
      <div>
        <div className="flex items-start gap-2">
          {sticker && (
            <span
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-lg"
            >
              {sticker.emoji}
            </span>
          )}

          <h2
            className={[
              'break-words text-base leading-6 font-semibold',
              task.completed
                ? 'text-[var(--text-faint)] line-through'
                : 'text-[var(--text-strong)]',
            ].join(' ')}
          >
            {task.title}
          </h2>
        </div>

        {task.description && (
          <p
            className={[
              'mt-1.5 break-words text-sm leading-5',
              task.completed
                ? 'text-[var(--text-faint)]'
                : 'text-[var(--text-secondary)]',
            ].join(' ')}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-soft)] pt-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()

            onToggle(
              task.id,
              task.dueDate,
            )
          }}
          aria-label={
            task.completed
              ? `Marcar ${task.title} como pendente`
              : `Marcar ${task.title} como concluída`
          }
          className={[
            'grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors',
            task.completed
              ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]',
          ].join(' ')}
        >
          {task.completed && (
            <Check size={18} strokeWidth={2.5} />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatTaskDate(task.dueDate)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {task.time ?? 'Sem horário'}
          </span>

          {task.estimatedMinutes !== null && (
            <span className="flex items-center gap-1.5">
              <Timer size={14} />
              {formatEstimatedMinutes(
                task.estimatedMinutes,
              )}
            </span>
          )}

          <span
            className={[
              'rounded-full px-2.5 py-1 font-medium',
              category
                ? categoryColorStyles[
                category.color
                ]
                : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
            ].join(' ')}
          >
            {category?.name ?? 'Sem categoria'}
          </span>

          <span
            className={[
              'flex items-center gap-1 rounded-full px-2.5 py-1 font-medium',
              priorityStyles[task.priority],
            ].join(' ')}
          >
            <Flag size={12} />
            {priorityLabels[task.priority]}
          </span>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onEdit(task)
            }}
            aria-label={`Editar ${task.title}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--primary-soft-hover)] hover:text-[var(--primary-strong)]"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(task)
            }}
            aria-label={`Excluir ${task.title}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}

