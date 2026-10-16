import {
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock3,
  Flag,
  ListTodo,
  Minus,
  Repeat2,
  Shapes,
  Timer,
  X,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { RitmoSelect } from '../ui/RitmoSelect'
import {
  categoryColorStyles,
} from '../../constants/categoryStyles'
import {
  categoryIcons,
} from '../../constants/categoryIcons'
import { useCategories } from '../../hooks/useCategories'
import type {
  CreateTaskData,
  RecurrenceFrequency,
  Task,
  TaskPriority,
} from '../../types/taskTypes'
import { getLocalDateValue } from '../../utils/date'

import { RitmoDatePicker } from '../ui/RitmoDatePicker'
import { RitmoTimeInput } from '../ui/RitmoTimeInput'

type TaskFormModalProps = {
  task?: Task
  onClose: () => void
  onSubmit: (
    taskData: CreateTaskData,
  ) => Promise<boolean>
  initialDate?: string
}

type RecurrenceOption =
  | 'none'
  | RecurrenceFrequency

type FieldLabelProps = {
  icon: LucideIcon
  children: ReactNode
  optional?: boolean
}

function FieldLabel({
  icon: Icon,
  children,
  optional = false,
}: FieldLabelProps) {
  return (
    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
      <Icon
        size={16}
        className="text-[var(--text-muted)]"
      />

      <span>{children}</span>

      {optional && (
        <span className="font-normal text-[var(--text-muted)]">
          (opcional)
        </span>
      )}
    </span>
  )
}

const priorities: {
  value: TaskPriority
  label: string
  icon: LucideIcon
  selectedClassName: string
}[] = [
  {
    value: 'low',
    label: 'Baixa',
    icon: ArrowDown,
    selectedClassName:
      'border-emerald-500/50 bg-emerald-500/10 text-emerald-600',
  },
  {
    value: 'medium',
    label: 'Média',
    icon: Minus,
    selectedClassName:
      'border-amber-500/50 bg-amber-500/10 text-amber-600',
  },
  {
    value: 'high',
    label: 'Alta',
    icon: ArrowUp,
    selectedClassName:
      'border-red-500/50 bg-red-500/10 text-red-600',
  },
]

const durationOptions = [
  {
    value: '',
    label: 'Não informar',
  },
  {
    value: '15',
    label: '15 minutos',
  },
  {
    value: '30',
    label: '30 minutos',
  },
  {
    value: '45',
    label: '45 minutos',
  },
  {
    value: '60',
    label: '1 hora',
  },
  {
    value: '90',
    label: '1h 30min',
  },
  {
    value: '120',
    label: '2 horas',
  },
  {
    value: '180',
    label: '3 horas',
  },
]

const recurrenceOptions: {
  value: RecurrenceOption
  label: string
}[] = [
  {
    value: 'none',
    label: 'Não repetir',
  },
  {
    value: 'daily',
    label: 'Diariamente',
  },
  {
    value: 'weekly',
    label: 'Semanalmente',
  },
  {
    value: 'monthly',
    label: 'Mensalmente',
  },
]

const weekDays = [
  {
    value: 1,
    label: 'Seg',
  },
  {
    value: 2,
    label: 'Ter',
  },
  {
    value: 3,
    label: 'Qua',
  },
  {
    value: 4,
    label: 'Qui',
  },
  {
    value: 5,
    label: 'Sex',
  },
  {
    value: 6,
    label: 'Sáb',
  },
  {
    value: 0,
    label: 'Dom',
  },
]

const inputStyles =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]'

function getWeekdayFromDateValue(
  dateValue: string,
) {
  const [year, month, day] =
    dateValue
      .split('-')
      .map(Number)

  return new Date(
    year,
    month - 1,
    day,
  ).getDay()
}

function getDayOfMonth(
  dateValue: string,
) {
  return Number(
    dateValue.split('-')[2],
  )
}

export function TaskFormModal({
  task,
  onClose,
  onSubmit,
  initialDate,
}: TaskFormModalProps) {
  const { categories } =
    useCategories()

  const [title, setTitle] =
    useState(task?.title ?? '')

  const [description, setDescription] =
    useState(
      task?.description ?? '',
    )

  const [dueDate, setDueDate] =
    useState(
      task?.dueDate ??
        initialDate ??
        getLocalDateValue(),
    )

  const [time, setTime] =
    useState(task?.time ?? '')

  const [categoryId, setCategoryId] =
    useState(
      task?.categoryId ?? '',
    )

  const [priority, setPriority] =
    useState<TaskPriority>(
      task?.priority ?? 'medium',
    )

  const [
    estimatedMinutes,
    setEstimatedMinutes,
  ] = useState(
    task?.estimatedMinutes
      ?.toString() ?? '',
  )

  const [
    recurrenceFrequency,
    setRecurrenceFrequency,
  ] =
    useState<RecurrenceOption>(
      task?.recurrence
        ?.frequency ?? 'none',
    )

  const [
    selectedWeekDays,
    setSelectedWeekDays,
  ] = useState<number[]>(
    task?.recurrence
      ?.daysOfWeek ?? [],
  )

  const [
    recurrenceEndDate,
    setRecurrenceEndDate,
  ] = useState(
    task?.recurrence?.endDate ??
      '',
  )

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const isEditing =
    Boolean(task)

  const categoryOptions =
    categories.map(
      (category) => ({
        value: category.id,
        label: category.name,
        icon:
          categoryIcons[
            category.icon
          ],
        iconClassName:
          categoryColorStyles[
            category.color
          ],
      }),
    )

  function handleRecurrenceChange(
    value: RecurrenceOption,
  ) {
    setRecurrenceFrequency(value)

    if (
      value === 'weekly' &&
      selectedWeekDays.length === 0
    ) {
      setSelectedWeekDays([
        getWeekdayFromDateValue(
          dueDate,
        ),
      ])
    }

    if (value === 'none') {
      setRecurrenceEndDate('')
    }
  }

  function toggleWeekDay(
    day: number,
  ) {
    setSelectedWeekDays(
      (currentDays) => {
        if (
          currentDays.includes(day)
        ) {
          return currentDays.filter(
            (currentDay) =>
              currentDay !== day,
          )
        }

        return [
          ...currentDays,
          day,
        ].sort(
          (
            firstDay,
            secondDay,
          ) =>
            firstDay -
            secondDay,
        )
      },
    )
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!title.trim()) {
      toast.error(
        'Digite o nome da tarefa.',
      )
      return
    }

    if (!dueDate) {
      toast.error(
        'Selecione a data da tarefa.',
      )
      return
    }

    if (!categoryId) {
      toast.error(
        'Selecione uma categoria.',
      )
      return
    }

    const selectedCategory =
      categories.find(
        (category) =>
          category.id ===
          categoryId,
      )

    if (!selectedCategory) {
      toast.error(
        'A categoria selecionada não existe mais.',
      )
      return
    }

    if (
      recurrenceFrequency ===
        'weekly' &&
      selectedWeekDays.length === 0
    ) {
      toast.error(
        'Selecione pelo menos um dia da semana.',
      )
      return
    }

    if (
      recurrenceEndDate &&
      recurrenceEndDate <
        dueDate
    ) {
      toast.error(
        'A data final não pode ser anterior à data inicial.',
      )
      return
    }

    const recurrence =
      recurrenceFrequency ===
      'none'
        ? null
        : {
            frequency:
              recurrenceFrequency,
            daysOfWeek:
              recurrenceFrequency ===
              'weekly'
                ? selectedWeekDays
                : [],
            endDate:
              recurrenceEndDate ||
              null,
          }

    setIsSubmitting(true)

    try {
      const success =
        await onSubmit({
          title: title.trim(),
          description:
            description.trim() ||
            null,
          dueDate,
          time: time || null,
          categoryId:
            selectedCategory.id,
          priority,
          estimatedMinutes:
            estimatedMinutes
              ? Number(
                  estimatedMinutes,
                )
              : null,
          recurrence,
        })

      if (success) {
        onClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      onMouseDown={
        isSubmitting
          ? undefined
          : onClose
      }
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] px-4 py-5 sm:px-6"
    >
      <section
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-6 border-b border-[var(--border-soft)] px-6 py-5 sm:px-7">
          <div>
            <div className="mb-1 flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-strong)]">
                <ListTodo size={18} />
              </div>

              <h2
                id="task-form-title"
                className="text-xl font-semibold text-[var(--text-primary)] sm:text-2xl"
              >
                {isEditing
                  ? 'Editar tarefa'
                  : 'Nova tarefa'}
              </h2>
            </div>

            <p className="ml-0 mt-2 text-sm text-[var(--text-muted)] sm:ml-[46px]">
              {isEditing
                ? 'Atualize os detalhes e o planejamento.'
                : 'Organize sua atividade de forma rápida.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
        >
          <div className="grid gap-7 px-6 py-6 sm:px-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
            <div className="space-y-5">
              <div>
                <FieldLabel
                  icon={ListTodo}
                >
                  Tarefa
                </FieldLabel>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="Ex.: Estudar Java"
                  autoFocus
                  className={inputStyles}
                />
              </div>

              <div>
                <FieldLabel
                  icon={AlignLeft}
                  optional
                >
                  Descrição
                </FieldLabel>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Adicione detalhes, observações ou contexto..."
                  rows={5}
                  className={`${inputStyles} resize-none`}
                />
              </div>

              <div>
                <FieldLabel
                  icon={Shapes}
                >
                  Categoria
                </FieldLabel>

                <RitmoSelect
                  value={categoryId}
                  options={
                    categoryOptions
                  }
                  onChange={
                    setCategoryId
                  }
                  placeholder="Selecione uma categoria"
                  ariaLabel="Selecionar categoria"
                />
              </div>
            </div>

            <div className="space-y-5 lg:border-l lg:border-[var(--border-soft)] lg:pl-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel
                    icon={
                      CalendarDays
                    }
                  >
                    Data
                  </FieldLabel>

                  <RitmoDatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    ariaLabel="Selecionar data da tarefa"
                  />
                </div>

                <div>
                  <FieldLabel
                    icon={Clock3}
                    optional
                  >
                    Horário
                  </FieldLabel>

                  <RitmoTimeInput
                    value={time}
                    onChange={setTime}
                    ariaLabel="Horário da tarefa"
                  />
                </div>
              </div>

              <div>
                <FieldLabel
                  icon={Flag}
                >
                  Prioridade
                </FieldLabel>

                <div className="grid grid-cols-3 gap-2">
                  {priorities.map(
                    (
                      priorityOption,
                    ) => {
                      const Icon =
                        priorityOption.icon

                      const isSelected =
                        priority ===
                        priorityOption.value

                      return (
                        <button
                          key={
                            priorityOption.value
                          }
                          type="button"
                          onClick={() =>
                            setPriority(
                              priorityOption.value,
                            )
                          }
                          aria-pressed={
                            isSelected
                          }
                          className={[
                            'flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-all sm:text-sm',
                            isSelected
                              ? priorityOption.selectedClassName
                              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
                          ].join(' ')}
                        >
                          <Icon
                            size={15}
                          />

                          {
                            priorityOption.label
                          }
                        </button>
                      )
                    },
                  )}
                </div>
              </div>

              <div>
                <FieldLabel
                  icon={Timer}
                  optional
                >
                  Duração estimada
                </FieldLabel>

                <RitmoSelect
                  value={
                    estimatedMinutes
                  }
                  options={
                    durationOptions
                  }
                  onChange={
                    setEstimatedMinutes
                  }
                  ariaLabel="Selecionar duração estimada"
                />
              </div>

              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                <FieldLabel
                  icon={Repeat2}
                >
                  Recorrência
                </FieldLabel>

                <RitmoSelect
                  value={
                    recurrenceFrequency
                  }
                  options={
                    recurrenceOptions
                  }
                  onChange={(value) =>
                    handleRecurrenceChange(
                      value as RecurrenceOption,
                    )
                  }
                  ariaLabel="Selecionar recorrência"
                />

                {recurrenceFrequency ===
                  'weekly' && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Dias da semana
                    </p>

                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7">
                      {weekDays.map(
                        (weekDay) => {
                          const isSelected =
                            selectedWeekDays.includes(
                              weekDay.value,
                            )

                          return (
                            <button
                              key={
                                weekDay.value
                              }
                              type="button"
                              onClick={() =>
                                toggleWeekDay(
                                  weekDay.value,
                                )
                              }
                              aria-pressed={
                                isSelected
                              }
                              className={[
                                'cursor-pointer rounded-xl border px-2 py-2 text-xs font-semibold transition-colors',
                                isSelected
                                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
                              ].join(' ')}
                            >
                              {
                                weekDay.label
                              }
                            </button>
                          )
                        },
                      )}
                    </div>
                  </div>
                )}

                {recurrenceFrequency !==
                  'none' && (
                  <div className="mt-4">
                    <FieldLabel
                      icon={
                        CalendarDays
                      }
                      optional
                    >
                      Data final
                    </FieldLabel>

                    <RitmoDatePicker
                      value={recurrenceEndDate}
                      min={dueDate}
                      onChange={
                        setRecurrenceEndDate
                      }
                      ariaLabel="Selecionar data final da recorrência"
                    />

                    {recurrenceFrequency ===
                      'daily' && (
                      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                        Será repetida todos os dias a partir da data inicial.
                      </p>
                    )}

                    {recurrenceFrequency ===
                      'monthly' && (
                      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                        Será repetida mensalmente no dia{' '}
                        {getDayOfMonth(
                          dueDate,
                        )}
                        .
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-[var(--border-soft)] px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar alterações'
                  : 'Criar tarefa'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}