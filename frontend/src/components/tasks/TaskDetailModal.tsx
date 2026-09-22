import { useEffect } from 'react'
import {
  CalendarDays,
  Check,
  Clock3,
  Flag,
  Pencil,
  Repeat2,
  Tag,
  Timer,
  Trash2,
  X,
} from 'lucide-react'
import { categoryStyles } from '../../constants/categoryStyles'
import {
  priorityLabels,
  priorityStyles,
} from '../../constants/taskStyles'
import type { Task } from '../../types/taskTypes'
import { formatEstimatedMinutes } from '../../utils/taskFormatters'
import {
  formatRecurrenceEndDate,
  formatTaskRecurrence,
} from '../../utils/taskRecurrence'

type TaskDetailsModalProps = {
  task: Task
  onClose: () => void
  onToggle: (
    taskId: string,
    occurrenceDate?: string,
  ) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function formatDetailsDate(
  dateValue: string,
) {
  const [year, month, day] =
    dateValue.split('-').map(Number)

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(year, month - 1, day),
  )
}

export function TaskDetailsModal({
  task,
  onClose,
  onToggle,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [onClose])

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) =>
          event.stopPropagation()
        }
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-5 border-b border-[#edf1ed] p-6 sm:p-7">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  task.completed
                    ? 'bg-[#e4f3e8] text-[#19683a]'
                    : 'bg-[#f1f3f1] text-[#667069]',
                ].join(' ')}
              >
                {task.completed
                  ? 'Concluída'
                  : 'Pendente'}
              </span>

              <span
                className={[
                  'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                  priorityStyles[
                  task.priority
                  ],
                ].join(' ')}
              >
                <Flag size={12} />
                {
                  priorityLabels[
                  task.priority
                  ]
                }
              </span>

              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  categoryStyles[
                  task.category
                  ],
                ].join(' ')}
              >
                {task.category}
              </span>
            </div>

            <h2
              id="task-details-title"
              className={[
                'break-words text-2xl font-bold tracking-tight sm:text-3xl',
                task.completed
                  ? 'text-[#7d8780] line-through'
                  : 'text-[#17211b]',
              ].join(' ')}
            >
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes da tarefa"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-[#7b847e] transition-colors hover:bg-[#f1f5f1] hover:text-[#27312b]"
          >
            <X size={21} />
          </button>
        </header>

        <div className="p-6 sm:p-7">
          <section>
            <p className="text-xs font-semibold tracking-wide text-[#8a938d] uppercase">
              Descrição
            </p>

            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#4f5a53]">
              {task.description ||
                'Nenhuma descrição adicionada.'}
            </p>
          </section>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f7faf7] p-4">
              <div className="flex items-center gap-2 text-[#19683a]">
                <CalendarDays size={18} />

                <span className="text-xs font-semibold uppercase">
                  {task.recurrence
                    ? 'Ocorrência'
                    : 'Data'}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-[#27312b] capitalize">
                {formatDetailsDate(
                  task.dueDate,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7faf7] p-4">
              <div className="flex items-center gap-2 text-[#19683a]">
                <Clock3 size={18} />

                <span className="text-xs font-semibold uppercase">
                  Horário
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-[#27312b]">
                {task.time ??
                  'Sem horário definido'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7faf7] p-4">
              <div className="flex items-center gap-2 text-[#19683a]">
                <Timer size={18} />

                <span className="text-xs font-semibold uppercase">
                  Duração estimada
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-[#27312b]">
                {task.estimatedMinutes !==
                  null
                  ? formatEstimatedMinutes(
                    task.estimatedMinutes,
                  )
                  : 'Não informada'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7faf7] p-4">
              <div className="flex items-center gap-2 text-[#19683a]">
                <Tag size={18} />

                <span className="text-xs font-semibold uppercase">
                  Categoria
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-[#27312b]">
                {task.category}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7faf7] p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-[#19683a]">
                <Repeat2 size={18} />

                <span className="text-xs font-semibold uppercase">
                  Repetição
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-[#27312b]">
                {formatTaskRecurrence(
                  task,
                )}
              </p>

              {task.recurrence && (
                <p className="mt-1 text-xs text-[#7b847e]">
                  {formatRecurrenceEndDate(
                    task,
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-[#edf1ed] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <button
            type="button"
            onClick={() =>
              onToggle(
                task.id,
                task.dueDate,
              )
            }
            className={[
              'flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
              task.completed
                ? 'border border-[#dce4dd] text-[#526057] hover:bg-[#f3f7f3]'
                : 'bg-[#e4f3e8] text-[#19683a] hover:bg-[#d8eddd]',
            ].join(' ')}
          >
            <Check size={18} />

            {task.completed
              ? 'Marcar como pendente'
              : 'Marcar como concluída'}
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onEdit(task)
                onClose()
              }}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dce4dd] px-4 py-2.5 text-sm font-semibold text-[#27312b] transition-colors hover:bg-[#f3f7f3] sm:flex-none"
            >
              <Pencil size={17} />
              Editar
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(task)
                onClose()
              }}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 sm:flex-none"
            >
              <Trash2 size={17} />
              Excluir
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}