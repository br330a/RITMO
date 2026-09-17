import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskCard } from '../components/tasks/TaskCard'
import { useTasks } from '../hooks/useTasks'
import { ConfirmDeleteModal } from '../components/tasks/ConfirmDeleteModal'
import type {
  Task,
  TaskPriority,
} from '../types/taskTypes'
import { TaskDetailsModal } from '../components/tasks/TaskDetailModal'

type TaskFilter = 'all' | 'pending' | 'completed'

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

const priorityOrder: Record<TaskPriority, number> = {
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

  return (firstTask.time ?? '23:59').localeCompare(
    secondTask.time ?? '23:59',
  )
}

function sortCompletedTasks(
  firstTask: Task,
  secondTask: Task,
) {
  const dateComparison =
    secondTask.dueDate.localeCompare(
      firstTask.dueDate,
    )

  if (dateComparison !== 0) {
    return dateComparison
  }

  return (secondTask.time ?? '00:00').localeCompare(
    firstTask.time ?? '00:00',
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

  const [activeFilter, setActiveFilter] =
    useState<TaskFilter>('all')

  const [isModalOpen, setIsModalOpen] =
    useState(false)

  const [taskToEdit, setTaskToEdit] =
    useState<Task | null>(null)

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null)

  const [selectedTaskId, setSelectedTaskId] =
    useState<string | null>(null)

  const selectedTask =
    tasks.find(
      (task) => task.id === selectedTaskId,
    ) ?? null

  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort(sortPendingTasks)

  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort(sortCompletedTasks)

  const hasTasksForActiveFilter =
    activeFilter === 'all'
      ? tasks.length > 0
      : activeFilter === 'pending'
        ? pendingTasks.length > 0
        : completedTasks.length > 0

  function renderTaskCard(task: Task) {
    return (
      <TaskCard
        key={task.id}
        task={task}
        onToggle={toggleTask}
        onDelete={setTaskToDelete}
        onEdit={setTaskToEdit}
        onOpen={(selectedTask) =>
          setSelectedTaskId(selectedTask.id)
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
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#23834b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19683a]"
          >
            <Plus size={19} />
            Nova tarefa
          </button>
        </header>

        <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-[#e4ebe5] overflow-hidden rounded-2xl border border-[#e4ebe5] bg-white shadow-sm">
          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#17211b]">
              {tasks.length}
            </strong>

            <span className="text-xs text-[#8a938d]">
              Total
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#b06b24]">
              {pendingTasks.length}
            </strong>

            <span className="text-xs text-[#8a938d]">
              Pendentes
            </span>
          </div>

          <div className="px-3 py-4 text-center">
            <strong className="block text-xl text-[#23834b]">
              {completedTasks.length}
            </strong>

            <span className="text-xs text-[#8a938d]">
              Concluídas
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
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

        {!hasTasksForActiveFilter ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#cfd8d1] bg-white px-6 py-12 text-center">
            <p className="font-medium text-[#27312b]">
              Nenhuma tarefa encontrada
            </p>

            <p className="mt-1 text-sm text-[#8a938d]">
              Experimente outro filtro ou crie uma nova
              tarefa.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {(activeFilter === 'all' ||
              activeFilter === 'pending') &&
              pendingTasks.length > 0 && (
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
                      {pendingTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingTasks.map(renderTaskCard)}
                  </div>
                </section>
              )}

            {(activeFilter === 'all' ||
              activeFilter === 'completed') &&
              completedTasks.length > 0 && (
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
                      {completedTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {completedTasks.map(renderTaskCard)}
                  </div>
                </section>
              )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <TaskFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={createTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onToggle={toggleTask}
          onEdit={setTaskToEdit}
          onDelete={setTaskToDelete}
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
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(null)
          }}
        />
      )}
    </>
  )
}