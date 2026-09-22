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
  TaskCategory,
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

type TaskFilter =
  | 'all'
  | 'pending'
  | 'completed'

type CategoryFilter =
  | 'all'
  | TaskCategory

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

const categories: {
  label: string
  value: CategoryFilter
}[] = [
    {
      label: 'Todas as categorias',
      value: 'all',
    },
    {
      label: 'Faculdade',
      value: 'Faculdade',
    },
    {
      label: 'Pessoal',
      value: 'Pessoal',
    },
    {
      label: 'Saúde',
      value: 'Saúde',
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
      task.category === categoryFilter

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
            <h1 className="text-3xl font-bold text-[#17211b]">
              Minhas tarefas
            </h1>

            <p className="mt-2 text-[#667069]">
              Organize todas as suas atividades em um só
              lugar.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsModalOpen(true)
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#23834b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19683a]"
          >
            <Plus size={19} />
            Nova tarefa
          </button>
        </header>

        <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-[#e4ebe5] overflow-hidden rounded-2xl border border-[#e4ebe5] bg-white shadow-sm">
          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#17211b]">
              {filteredTasksCount}
            </strong>

            <span className="text-xs text-[#8a938d]">
              Total
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#b06b24]">
              {filteredPendingTasks.length}
            </strong>

            <span className="text-xs text-[#8a938d]">
              Pendentes
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#23834b]">
              {filteredCompletedTasks.length}
            </strong>

            <span className="text-xs text-[#8a938d]">
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
                    ? 'bg-[#23834b] text-white'
                    : 'border border-[#dce4dd] bg-white text-[#667069] hover:bg-[#f3f7f3]',
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
                ? 'border-[#b9d8c2] bg-[#e4f3e8] text-[#19683a]'
                : 'border-[#dce4dd] bg-white text-[#667069] hover:bg-[#f3f7f3]',
            ].join(' ')}
          >
            <SlidersHorizontal size={16} />

            Filtros

            {activeFiltersCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-[#23834b] px-1.5 py-0.5 text-[11px] font-bold text-white">
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
          <div className="mt-4 rounded-2xl border border-[#e4ebe5] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="text-[#19683a]"
                />

                <h2 className="text-sm font-semibold text-[#27312b]">
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
                    ? 'cursor-pointer text-[#19683a] hover:bg-[#e4f3e8]'
                    : 'cursor-not-allowed text-[#b3bab5]',
                ].join(' ')}
              >
                <X size={14} />
                Limpar filtros
              </button>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#8a938d]"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Buscar por título ou descrição..."
                aria-label="Buscar tarefas"
                className="w-full rounded-xl border border-[#dce4dd] bg-white py-3 pr-11 pl-11 text-sm text-[#27312b] outline-none transition placeholder:text-[#9aa29d] focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                  className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-[#8a938d] hover:bg-[#f3f7f3] hover:text-[#27312b]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#667069]">
                  Categoria
                </span>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value as CategoryFilter,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-[#dce4dd] bg-white px-3 py-2.5 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]"
                >
                  {categories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#667069]">
                  Prioridade
                </span>

                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value as PriorityFilter,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-[#dce4dd] bg-white px-3 py-2.5 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]"
                >
                  {priorities.map((priority) => (
                    <option
                      key={priority.value}
                      value={priority.value}
                    >
                      {priority.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2 lg:col-span-1">
                <span className="mb-1.5 block text-xs font-medium text-[#667069]">
                  Recorrência
                </span>

                <select
                  value={recurrenceFilter}
                  onChange={(event) =>
                    setRecurrenceFilter(
                      event.target.value as RecurrenceFilter,
                    )
                  }
                  className="w-full cursor-pointer rounded-xl border border-[#dce4dd] bg-white px-3 py-2.5 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]"
                >
                  {recurrences.map((recurrence) => (
                    <option
                      key={recurrence.value}
                      value={recurrence.value}
                    >
                      {recurrence.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {hasActiveFilters && (
              <p className="mt-4 border-t border-[#edf1ed] pt-4 text-xs text-[#8a938d]">
                {filteredTasksCount}{' '}
                {filteredTasksCount === 1
                  ? 'tarefa encontrada'
                  : 'tarefas encontradas'}
              </p>
            )}
          </div>
        )}

        {!hasTasksForActiveFilter ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#cfd8d1] bg-white px-6 py-12 text-center">
            <Search
              size={30}
              className="mx-auto text-[#a1aaa4]"
            />

            <p className="mt-4 font-medium text-[#27312b]">
              {hasActiveFilters
                ? 'Nenhuma tarefa corresponde aos filtros'
                : 'Nenhuma tarefa encontrada'}
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#8a938d]">
              {hasActiveFilters
                ? 'Altere a busca ou os filtros para encontrar outras tarefas.'
                : 'Experimente outro status ou crie uma nova tarefa.'}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 cursor-pointer rounded-xl bg-[#e4f3e8] px-4 py-2.5 text-sm font-semibold text-[#19683a] hover:bg-[#d8eddd]"
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
                      <h2 className="text-lg font-semibold text-[#17211b]">
                        Pendentes
                      </h2>

                      <p className="mt-1 text-sm text-[#8a938d]">
                        Prioridades mais importantes aparecem
                        primeiro.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#fff3dc] px-3 py-1 text-xs font-semibold text-[#96651f]">
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
                      <h2 className="text-lg font-semibold text-[#17211b]">
                        Concluídas
                      </h2>

                      <p className="mt-1 text-sm text-[#8a938d]">
                        As tarefas finalizadas ficam
                        separadas das pendentes.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#e4f3e8] px-3 py-1 text-xs font-semibold text-[#19683a]">
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
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(null)
          }}
        />
      )}
    </>
  )
}