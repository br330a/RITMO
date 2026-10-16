import {
  ArrowRight,
  Clock3,
  Flag,
  Timer,
} from 'lucide-react'
import { Link } from 'react-router'
import { categoryColorStyles } from '../../constants/categoryStyles'
import { useCategories } from '../../hooks/useCategories'
import { getCategoryById } from '../../utils/categoryUtils'
import {
  priorityLabels,
  priorityStyles,
} from '../../constants/taskStyles'
import { useTasks } from '../../hooks/useTasks'
import type { Task } from '../../types/taskTypes'
import {
  formatTaskDate,
  getLocalDateValue,
} from '../../utils/date'
import { formatEstimatedMinutes } from '../../utils/taskFormatters'
import { getNextPendingOccurrence } from '../../utils/taskRecurrence'

type UpcomingTasksProps = {
  onOpenTask: (task: Task) => void
}

export function UpcomingTasks({
  onOpenTask,
}: UpcomingTasksProps) {
  const { tasks } = useTasks()
  const { categories } = useCategories()
  const today = getLocalDateValue()

  const upcomingTasks = tasks
    .flatMap((task) => {
      const occurrence =
        getNextPendingOccurrence(
          task,
          today,
        )

      return occurrence
        ? [occurrence]
        : []
    })
    .sort((firstTask, secondTask) => {
      const dateComparison =
        firstTask.dueDate.localeCompare(
          secondTask.dueDate,
        )

      return dateComparison !== 0
        ? dateComparison
        : (
          firstTask.time ?? '23:59'
        ).localeCompare(
          secondTask.time ?? '23:59',
        )
    })
    .slice(0, 2)

  return (
    <article className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-sm">
      <header className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock3
            size={22}
            className="text-[var(--primary-strong)]"
          />

          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Próximas tarefas
          </h2>
        </div>

        <Link
          to="/tarefas"
          className="flex items-center gap-1 text-xs font-semibold text-[var(--primary-strong)] hover:underline"
        >
          Ver todas
          <ArrowRight size={14} />
        </Link>
      </header>

      {upcomingTasks.length === 0 ? (
        <p className="pt-4 text-sm text-[var(--text-muted)]">
          Nenhuma tarefa futura.
        </p>
      ) : (
        <div>
            {upcomingTasks.map((task) => {
              const category = getCategoryById(
                categories,
                task.categoryId,
              )

              return (
                <div
              key={`${task.id}-${task.dueDate}`}
              role="button"
              tabIndex={0}
              onClick={() => onOpenTask(task)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault()
                  onOpenTask(task)
                }
              }}
              className="-mx-2 cursor-pointer rounded-xl border-b border-[var(--border-soft)] px-2 py-4 transition-colors last:border-none last:pb-2 hover:bg-[var(--surface-hover)]"
            >
              <p className="text-xs text-[var(--text-muted)]">
                {formatTaskDate(task.dueDate)}

                {task.time
                  ? `, ${task.time}`
                  : ', sem horário'}
              </p>

              <p className="mt-1 break-words text-sm font-medium text-[var(--text-strong)]">
                {task.title}
              </p>

              {task.description && (
                <p className="mt-1 break-words text-xs leading-5 text-[var(--text-muted)]">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
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
                    priorityStyles[
                    task.priority
                    ],
                  ].join(' ')}
                >
                  <Flag size={11} />

                  {
                    priorityLabels[
                    task.priority
                    ]
                  }
                </span>

                {task.estimatedMinutes !==
                  null && (
                    <span className="flex items-center gap-1 text-[var(--text-muted)]">
                      <Timer size={13} />

                      {formatEstimatedMinutes(
                        task.estimatedMinutes,
                      )}
                    </span>
                  )}
              </div>
                </div>
              )
            })}
        </div>
      )}
    </article>
  )
}

