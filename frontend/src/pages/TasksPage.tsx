import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskCard } from '../components/tasks/TaskCard'
import { useTasks } from '../hooks/useTasks'
import { ConfirmDeleteModal } from '../components/tasks/ConfirmDeleteModal'
import type {
  RecurrenceFrequency,
  Task,
  TaskPriority,
} from '../types/taskTypes'
import { TaskDetailsModal } from '../components/tasks/TaskDetailModal'
import {
  getCompletedOccurrences,
  getNextPendingOccurrence,
  getTaskOccurrence,
} from '../utils/taskRecurrence'
import { isTaskArchived } from '../utils/taskStatus'
import { getLocalDateValue } from '../utils/date'
import { useCategories } from '../hooks/useCategories'

import {
  RitmoSelect,
} from '../components/ui/RitmoSelect'
import {
  categoryColorStyles,
} from '../constants/categoryStyles'
import {
  categoryIcons,
} from '../constants/categoryIcons'

type TaskFilter =
  | 'all'
  | 'pending'
  | 'completed'

type CategoryFilter = string

type PriorityFilter =
  | 'all'
  | TaskPriority

type RecurrenceFilter =
  | 'all'
  | 'none'
  | RecurrenceFrequency

type TaskReference = {
  taskId: string
  occurrenceDate: string
}

const filters: {
  label: string
  value: TaskFilter
}[] = [
    {
      label: 'Todas',
      value: 'all',
    },
    {
      label: 'Pendentes',
      value: 'pending',
    },
    {
      label: 'Concluídas',
      value: 'completed',
    },
  ]


const priorities: {
  label: string
  value: PriorityFilter
}[] = [
    {
      label: 'Todas as prioridades',
      value: 'all',
    },
    {
      label: 'Alta',
      value: 'high',
    },
    {
      label: 'Média',
      value: 'medium',
    },
    {
      label: 'Baixa',
      value: 'low',
    },
  ]

const recurrences: {
  label: string
  value: RecurrenceFilter
}[] = [
    {
      label: 'Qualquer repetição',
      value: 'all',
    },
    {
      label: 'Não recorrentes',
      value: 'none',
    },
    {
      label: 'Diárias',
      value: 'daily',
    },
    {
      label: 'Semanais',
      value: 'weekly',
    },
    {
      label: 'Mensais',
      value: 'monthly',
    },
  ]

const priorityOrder: Record<
  TaskPriority,
  number
> = {
  high: 0,
  medium: 1,
  low: 2,
}

function sortPendingTasks(
  firstTask: Task,
  secondTask: Task,
) {
  const priorityComparison =
    priorityOrder[firstTask.priority] -
    priorityOrder[secondTask.priority]

  if (priorityComparison !== 0) {
    return priorityComparison
  }

  const dateComparison =
    firstTask.dueDate.localeCompare(
      secondTask.dueDate,
    )

  if (dateComparison !== 0) {
    return dateComparison
  }

  return (
    firstTask.time ?? '23:59'
  ).localeCompare(
    secondTask.time ?? '23:59',
  )
}

function sortCompletedTasks(
  firstTask: Task,
  secondTask: Task,
) {
  return (
    secondTask.completedAt ?? ''
  ).localeCompare(
    firstTask.completedAt ?? '',
  )
}

export function TasksPage() {
  const {
    tasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks()

  const { categories } = useCategories()

  const categoryOptions = [
    {
      value: 'all',
      label: 'Todas as categorias',
    },
    ...categories.map(
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
    ),
  ]
  const today = getLocalDateValue()

  const [activeFilter, setActiveFilter] =
    useState<TaskFilter>('all')

  const [isFiltersOpen, setIsFiltersOpen] =
    useState(false)

  const [searchTerm, setSearchTerm] =
    useState('')

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState<CategoryFilter>('all')

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<PriorityFilter>('all')

  const [
    recurrenceFilter,
    setRecurrenceFilter,
  ] = useState<RecurrenceFilter>('all')

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [taskToEdit, setTaskToEdit] =
    useState<Task | null>(null)

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null)

  const [
    selectedTaskReference,
    setSelectedTaskReference,
  ] = useState<TaskReference | null>(null)

  const selectedTask = (() => {
    if (!selectedTaskReference) {
      return null
    }

    const baseTask = tasks.find(
      (task) =>
        task.id ===
        selectedTaskReference.taskId,
    )

    if (!baseTask) {
      return null
    }

    return getTaskOccurrence(
      baseTask,
      selectedTaskReference.occurrenceDate,
    )
  })()

  const pendingTasks = tasks
    .flatMap((task) => {
      if (!task.recurrence) {
        return task.completed
          ? []
          : [task]
      }

      const nextOccurrence =
        getNextPendingOccurrence(
          task,
          today,
          true,
        )

      return nextOccurrence
        ? [nextOccurrence]
        : []
    })
    .sort(sortPendingTasks)

  const completedTasks = tasks
    .flatMap((task) => {
      if (!task.recurrence) {
        if (
          task.completed &&
          !isTaskArchived(task)
        ) {
          return [task]
        }

        return []
      }

      return getCompletedOccurrences(task)
        .filter(
          (occurrence) =>
            !isTaskArchived(occurrence),
        )
    })
    .sort(sortCompletedTasks)

  const normalizedSearchTerm =
    searchTerm.trim().toLocaleLowerCase(
      'pt-BR',
    )

  function matchesFilters(task: Task) {
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      task.title
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearchTerm) ||
      (task.description ?? '')
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearchTerm)

    const matchesCategory =
      categoryFilter === 'all' ||
      task.categoryId === categoryFilter

    const matchesPriority =
      priorityFilter === 'all' ||
      task.priority === priorityFilter

    const matchesRecurrence =
      recurrenceFilter === 'all' ||
      (recurrenceFilter === 'none'
        ? task.recurrence === null
        : task.recurrence?.frequency ===
        recurrenceFilter)

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesRecurrence
    )
  }

  const filteredPendingTasks =
    pendingTasks.filter(matchesFilters)

  const filteredCompletedTasks =
    completedTasks.filter(matchesFilters)

  const filteredTasksCount =
    filteredPendingTasks.length +
    filteredCompletedTasks.length

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    recurrenceFilter !== 'all'

  const activeFiltersCount = [
    searchTerm.trim().length > 0,
    categoryFilter !== 'all',
    priorityFilter !== 'all',
    recurrenceFilter !== 'all',
  ].filter(Boolean).length

  const hasTasksForActiveFilter =
    activeFilter === 'all'
      ? filteredTasksCount > 0
      : activeFilter === 'pending'
        ? filteredPendingTasks.length > 0
        : filteredCompletedTasks.length > 0

  function clearFilters() {
    setSearchTerm('')
    setCategoryFilter('all')
    setPriorityFilter('all')
    setRecurrenceFilter('all')
  }

  function getBaseTask(task: Task) {
    return (
      tasks.find(
        (currentTask) =>
          currentTask.id === task.id,
      ) ?? task
    )
  }

  function renderTaskCard(task: Task) {
    return (
      <TaskCard
        key={`${task.id}-${task.dueDate}`}
        task={task}
        onToggle={toggleTask}
        onEdit={(selectedTask) =>
          setTaskToEdit(
            getBaseTask(selectedTask),
          )
        }
        onDelete={(selectedTask) =>
          setTaskToDelete(
            getBaseTask(selectedTask),
          )
        }
        onOpen={(selectedTask) =>
          setSelectedTaskReference({
            taskId: selectedTask.id,
            occurrenceDate:
              selectedTask.dueDate,
          })
        }
      />
    )
  }

  return (
    <>
      <section className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Minhas tarefas
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Organize todas as suas atividades em um só
              lugar.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsModalOpen(true)
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]"
          >
            <Plus size={19} />
            Nova tarefa
          </button>
        </header>

        <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-[var(--border-soft)] overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-sm">
          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[var(--text-primary)]">
              {filteredTasksCount}
            </strong>

            <span className="text-xs text-[var(--text-muted)]">
              Total
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-amber-500">
              {filteredPendingTasks.length}
            </strong>

            <span className="text-xs text-[var(--text-muted)]">
              Pendentes
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[var(--primary)]">
              {filteredCompletedTasks.length}
            </strong>

            <span className="text-xs text-[var(--text-muted)]">
              Concluídas
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                className={[
                  'cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  activeFilter === filter.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
                ].join(' ')}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setIsFiltersOpen(
                (currentValue) => !currentValue,
              )
            }
            aria-expanded={isFiltersOpen}
            className={[
              'flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors',
              isFiltersOpen || hasActiveFilters
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-strong)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
            ].join(' ')}
          >
            <SlidersHorizontal size={16} />

            Filtros

            {activeFiltersCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[11px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}

            {isFiltersOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>

        {isFiltersOpen && (
          <div className="mt-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="text-[var(--primary-strong)]"
                />

                <h2 className="text-sm font-semibold text-[var(--text-strong)]">
                  Buscar e filtrar
                </h2>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={[
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  hasActiveFilters
                    ? 'cursor-pointer text-[var(--primary-strong)] hover:bg-[var(--primary-soft-hover)]'
                    : 'cursor-not-allowed text-[var(--text-faint)]',
                ].join(' ')}
              >
                <X size={14} />
                Limpar filtros
              </button>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar por título ou descrição..."
                aria-label="Buscar tarefas"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pr-11 pl-11 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)]"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-strong)]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Categoria
                </span>

                <RitmoSelect
                  value={categoryFilter}
                  options={categoryOptions}
                  onChange={
                    setCategoryFilter
                  }
                  ariaLabel="Filtrar por categoria"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Prioridade
                </span>

                <RitmoSelect
                  value={priorityFilter}
                  options={priorities}
                  onChange={(value) =>
                    setPriorityFilter(
                      value as PriorityFilter,
                    )
                  }
                  ariaLabel="Filtrar por prioridade"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <span className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Recorrência
                </span>

                <RitmoSelect
                  value={recurrenceFilter}
                  options={recurrences}
                  onChange={(value) =>
                    setRecurrenceFilter(
                      value as RecurrenceFilter,
                    )
                  }
                  ariaLabel="Filtrar por recorrência"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <p className="mt-4 border-t border-[var(--border-soft)] pt-4 text-xs text-[var(--text-muted)]">
                {filteredTasksCount}{' '}
                {filteredTasksCount === 1
                  ? 'tarefa encontrada'
                  : 'tarefas encontradas'}
              </p>
            )}
          </div>
        )}

        {!hasTasksForActiveFilter ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
            <Search
              size={30}
              className="mx-auto text-[var(--text-faint)]"
            />

            <p className="mt-4 font-medium text-[var(--text-strong)]">
              {hasActiveFilters
                ? 'Nenhuma tarefa corresponde aos filtros'
                : 'Nenhuma tarefa encontrada'}
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              {hasActiveFilters
                ? 'Altere a busca ou os filtros para encontrar outras tarefas.'
                : 'Experimente outro status ou crie uma nova tarefa.'}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 cursor-pointer rounded-xl bg-[var(--primary-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-strong)] hover:bg-[var(--primary-soft-hover)]"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {(activeFilter === 'all' ||
              activeFilter === 'pending') &&
              filteredPendingTasks.length >
              0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Pendentes
                      </h2>

                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Prioridades mais importantes aparecem
                        primeiro.
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
                      {
                        filteredPendingTasks.length
                      }
                    </span>
                  </div>

                  <div className="space-y-3">
                    {filteredPendingTasks.map(
                      renderTaskCard,
                    )}
                  </div>
                </section>
              )}

            {(activeFilter === 'all' ||
              activeFilter ===
              'completed') &&
              filteredCompletedTasks.length >
              0 && (
                <section>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Concluídas
                      </h2>

                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        As tarefas finalizadas ficam
                        separadas das pendentes.
                      </p>
                    </div>

                    <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary-strong)]">
                      {
                        filteredCompletedTasks.length
                      }
                    </span>
                  </div>

                  <div className="space-y-3">
                    {filteredCompletedTasks.map(
                      renderTaskCard,
                    )}
                  </div>
                </section>
              )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <TaskFormModal
          onClose={() =>
            setIsModalOpen(false)
          }
          onSubmit={createTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() =>
            setSelectedTaskReference(null)
          }
          onToggle={toggleTask}
          onEdit={(task) =>
            setTaskToEdit(
              getBaseTask(task),
            )
          }
          onDelete={(task) =>
            setTaskToDelete(
              getBaseTask(task),
            )
          }
        />
      )}

      {taskToEdit && (
        <TaskFormModal
          key={taskToEdit.id}
          task={taskToEdit}
          onClose={() =>
            setTaskToEdit(null)
          }
          onSubmit={(taskData) =>
            updateTask(
              taskToEdit.id,
              taskData,
            )
          }
        />
      )}

      {taskToDelete && (
        <ConfirmDeleteModal
          taskTitle={taskToDelete.title}
          onCancel={() =>
            setTaskToDelete(null)
          }
          onConfirm={() =>
            deleteTask(taskToDelete.id)
          }
        />
      )}
    </>
  )
}

