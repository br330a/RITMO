import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskList } from '../components/dashboard/TaskList'
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks'
import { WeekOverview } from '../components/dashboard/WeekOverview'
import { useTasks } from '../hooks/useTasks'
import { getLocalDateValue } from '../utils/date'
import { TaskDetailsModal } from '../components/tasks/TaskDetailModal'

import { ConfirmDeleteModal } from '../components/tasks/ConfirmDeleteModal'
import type { Task } from '../types/taskTypes'
import {
  getTaskOccurrence,
  getTasksForDate,
} from '../utils/taskRecurrence'

export function DashboardPage() {
  const {
    tasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

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
        task.id === selectedTaskReference.taskId,
    )

    if (!baseTask) {
      return null
    }

    return getTaskOccurrence(
      baseTask,
      selectedTaskReference.occurrenceDate,
    )
  })()

  const [selectedDate, setSelectedDate] = useState(
    () => getLocalDateValue(),
  )

  const selectedTasks = getTasksForDate(
    tasks,
    selectedDate,
  ).sort((firstTask, secondTask) =>
    (firstTask.time ?? '99:99').localeCompare(
      secondTask.time ?? '99:99',
    ),
  )

  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <>
      <section className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#17211b]">
              Bom dia, Bruno!
            </h1>

            <p className="mt-2 text-lg text-[#667069]">
              Vamos organizar o seu dia?
            </p>

            <p className="mt-3 capitalize text-sm text-[#8a938d]">
              {currentDate}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#23834b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#19683a]"
          >
            <Plus size={19} />
            Nova tarefa
          </button>
        </header>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <TaskList
            key={selectedDate}
            selectedDate={selectedDate}
            tasks={selectedTasks}
            onToggleTask={toggleTask}
            onEditTask={(task) => {
              const baseTask =
                tasks.find(
                  (currentTask) =>
                    currentTask.id === task.id,
                ) ?? task

              setTaskToEdit(baseTask)
            }}
            onDeleteTask={setTaskToDelete}
            onOpenTask={(task) =>
              setSelectedTaskReference({
                taskId: task.id,
                occurrenceDate: task.dueDate,
              })
            }
          />

          <aside className="flex flex-col gap-6">
            <WeekOverview
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <UpcomingTasks
              onOpenTask={(task) =>
                setSelectedTaskReference({
                  taskId: task.id,
                  occurrenceDate: task.dueDate,
                })
              }
            />
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

      {isModalOpen && (
        <TaskFormModal
          initialDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
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
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(null)
          }}
        />
      )}
    </>
  )
}