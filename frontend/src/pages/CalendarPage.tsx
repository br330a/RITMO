import { useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  Check,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { MonthCalendar } from '../components/calendar/MonthCalendar'
import { ConfirmDeleteModal } from '../components/tasks/ConfirmDeleteModal'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { categoryColorStyles } from '../constants/categoryStyles'
import { useCategories } from '../hooks/useCategories'
import { getCategoryById } from '../utils/categoryUtils'
import { useTasks } from '../hooks/useTasks'
import type { Task } from '../types/taskTypes'
import { getLocalDateValue } from '../utils/date'

import { TaskDetailsModal } from '../components/tasks/TaskDetailModal'
import {
  getTaskOccurrence,
  getTasksForDate,
} from '../utils/taskRecurrence'

import {
  getTaskSticker,
} from '../constants/taskStickers'

function formatSelectedDate(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function getInitialCalendarDate(dateValue: string | null) {
  if (!dateValue || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return new Date()
  }

  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (getLocalDateValue(date) !== dateValue) {
    return new Date()
  }

  return date
}

export function CalendarPage() {
  const [searchParams] = useSearchParams()

  const [initialCalendarDate] = useState(() =>
    getInitialCalendarDate(searchParams.get('date'))
  )

  const todayValue = getLocalDateValue()
  const {
    tasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks()

  const { categories } = useCategories()

    const [selectedDate, setSelectedDate] = useState(
      () => getLocalDateValue(initialCalendarDate),
    )

    const [currentMonth, setCurrentMonth] = useState(
      () => initialCalendarDate,
    )
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null)

  const [
    selectedTaskReference,
    setSelectedTaskReference,
  ] = useState<{
    taskId: string
    occurrenceDate: string
  } | null>(null)

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

  const todayDate = new Date()

  const isViewingToday =
    selectedDate === todayValue &&
    currentMonth.getMonth() === todayDate.getMonth() &&
    currentMonth.getFullYear() === todayDate.getFullYear()

  const selectedTasks = getTasksForDate(
    tasks,
    selectedDate,
  ).sort((firstTask, secondTask) =>
    (firstTask.time ?? '23:59').localeCompare(
      secondTask.time ?? '23:59',
    ),
  )

  function handleGoToToday() {
    const today = new Date()

    setCurrentMonth(today)
    setSelectedDate(getLocalDateValue(today))
  }

  return (
    <>
      <section className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Calendário
            </h1>

            <p className="mt-2 text-[var(--text-secondary)]">
              Visualize sua rotina e selecione um dia.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGoToToday}
              disabled={isViewingToday}
              className={[
                'cursor-pointer rounded-xl border px-5 py-3 text-sm font-semibold transition-colors',
                isViewingToday
                  ? 'cursor-default border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] shadow-inner'
                  : 'border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]',
              ].join(' ')}
            >
              Hoje
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]"
            >
              <Plus size={19} />
              Nova tarefa
            </button>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <MonthCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            tasks={tasks}
            onMonthChange={setCurrentMonth}
            onSelectDate={setSelectedDate}
          />

          <aside className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold capitalize text-[var(--text-primary)]">
                  {formatSelectedDate(selectedDate)}
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {selectedTasks.length === 1
                    ? '1 tarefa agendada'
                    : `${selectedTasks.length} tarefas agendadas`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                aria-label="Criar tarefa neste dia"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-strong)] hover:bg-[var(--primary-soft-hover)]"
              >
                <Plus size={18} />
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  Nenhuma tarefa para este dia.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                  {selectedTasks.map((task) => {
                    const category = getCategoryById(
                      categories,
                      task.categoryId,
                    )

                    const sticker =
                      getTaskSticker(
                        task.sticker,
                      )

                    return (
                  <div
                    key={`${task.id}-${task.dueDate}`}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSelectedTaskReference({
                        taskId: task.id,
                        occurrenceDate: task.dueDate,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) {
                        return
                      }

                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()
                        setSelectedTaskReference({
                          taskId: task.id,
                          occurrenceDate: task.dueDate,
                        })
                      }
                    }}
                    className="cursor-pointer rounded-xl border border-[var(--border-soft)] p-4 transition-all hover:border-[var(--border)] hover:bg-[var(--surface-hover)] hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleTask(
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
                          'mt-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border',
                          task.completed
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : 'border-[var(--border)]',
                        ].join(' ')}
                      >
                        {task.completed && (
                          <Check size={14} strokeWidth={2.5} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          {sticker && (
                            <span
                              aria-hidden="true"
                              className="shrink-0 text-base"
                            >
                              {sticker.emoji}
                            </span>
                          )}

                          <p
                            className={[
                              'text-sm font-medium',
                              task.completed
                                ? 'text-[var(--text-faint)] line-through'
                                : 'text-[var(--text-strong)]',
                            ].join(' ')}
                          >
                            {task.title}
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span>{task.time ?? 'Sem horário'}</span>

                              <span
                                className={[
                                  'rounded-full px-2.5 py-1 text-xs font-medium',
                                  category
                                    ? categoryColorStyles[
                                    category.color
                                    ]
                                    : 'bg-[var(--surface-muted)] text-[var(--text-secondary)]',
                                ].join(' ')}
                              >
                                {category?.name ?? 'Sem categoria'}
                              </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-1 border-t border-[var(--border-soft)] pt-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setTaskToEdit(
                            tasks.find(
                              (currentTask) =>
                                currentTask.id === task.id,
                            ) ?? task,
                          )
                        }}
                        aria-label={`Editar ${task.title}`}
                        className="grid size-8 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--primary-soft-hover)] hover:text-[var(--primary-strong)]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setTaskToDelete(task)
                        }}
                        aria-label={`Excluir ${task.title}`}
                        className="grid size-8 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </aside>
        </div>
      </section>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() =>
            setSelectedTaskReference(null)
          }
          onToggle={toggleTask}
          onEdit={(task) => {
            const baseTask =
              tasks.find(
                (currentTask) =>
                  currentTask.id === task.id,
              ) ?? task

            setTaskToEdit(baseTask)
          }}
          onDelete={setTaskToDelete}
        />
      )}

      {isCreateModalOpen && (
        <TaskFormModal
          initialDate={selectedDate}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createTask}
        />
      )}

      {taskToEdit && (
        <TaskFormModal
          key={taskToEdit.id}
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSubmit={(taskData) =>
            updateTask(taskToEdit.id, taskData)
          }
        />
      )}

      {taskToDelete && (
        <ConfirmDeleteModal
          taskTitle={taskToDelete.title}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={() =>
            deleteTask(taskToDelete.id)
          }
        />
      )}
    </>
  )
}

