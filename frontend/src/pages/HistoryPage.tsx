import { useState } from 'react'
import { History } from 'lucide-react'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskDetailsModal } from '../components/tasks/TaskDetailModal'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { ConfirmDeleteModal } from '../components/tasks/ConfirmDeleteModal'
import { useTasks } from '../hooks/useTasks'
import type { Task } from '../types/taskTypes'
import {
  getCompletedOccurrences,
  getTaskOccurrence,
} from '../utils/taskRecurrence'
import {
  COMPLETED_TASK_RETENTION_DAYS,
  isTaskArchived,
} from '../utils/taskStatus'

type TaskReference = {
  taskId: string
  occurrenceDate: string
}

export function HistoryPage() {
  const {
    tasks,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks()

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

  const archivedTasks = tasks
    .flatMap((task) => {
      if (!task.recurrence) {
        return isTaskArchived(task)
          ? [task]
          : []
      }

      return getCompletedOccurrences(task)
        .filter(
          (occurrence) =>
            isTaskArchived(occurrence),
        )
    })
    .sort((firstTask, secondTask) =>
      (
        secondTask.completedAt ?? ''
      ).localeCompare(
        firstTask.completedAt ?? '',
      ),
    )

  function getBaseTask(task: Task) {
    return (
      tasks.find(
        (currentTask) =>
          currentTask.id === task.id,
      ) ?? task
    )
  }

  return (
    <>
      <section className="mx-auto max-w-5xl">
        <header>
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary-strong)]">
              <History size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Histórico
              </h1>

              <p className="mt-1 text-[var(--text-secondary)]">
                Tarefas concluídas há mais de{' '}
                {COMPLETED_TASK_RETENTION_DAYS}{' '}
                dias.
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8">
          <div className="inline-flex items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-4 shadow-sm">
            <div>
              <strong className="block text-2xl text-[var(--text-primary)]">
                {archivedTasks.length}
              </strong>

              <span className="text-xs text-[var(--text-muted)]">
                Tarefas arquivadas
              </span>
            </div>
          </div>
        </div>

        {archivedTasks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <History
              size={32}
              className="mx-auto text-[var(--text-faint)]"
            />

            <p className="mt-4 font-medium text-[var(--text-strong)]">
              Seu histórico está vazio
            </p>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Tarefas concluídas há mais de{' '}
              {COMPLETED_TASK_RETENTION_DAYS}{' '}
              dias aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {archivedTasks.map((task) => (
              <TaskCard
                key={`${task.id}-${task.dueDate}`}
                task={task}
                onToggle={toggleTask}
                onEdit={(selectedTask) =>
                  setTaskToEdit(
                    getBaseTask(
                      selectedTask,
                    ),
                  )
                }
                onDelete={(selectedTask) =>
                  setTaskToDelete(
                    getBaseTask(
                      selectedTask,
                    ),
                  )
                }
                onOpen={(selectedTask) =>
                  setSelectedTaskReference({
                    taskId:
                      selectedTask.id,
                    occurrenceDate:
                      selectedTask.dueDate,
                  })
                }
              />
            ))}
          </div>
        )}
      </section>

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

