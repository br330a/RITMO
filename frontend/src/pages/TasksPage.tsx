import { useState } from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '../components/tasks/NewTaskModal'
import { TaskCard } from '../components/tasks/TaskCard'
import { useTasks } from '../hooks/useTasks'

type TaskFilter = 'all' | 'pending' | 'completed'

const filters: { label: string; value: TaskFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'completed' },
]

export function TasksPage() {
  const { tasks, createTask, toggleTask } = useTasks()
  const [activeFilter, setActiveFilter] =
    useState<TaskFilter>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTasks = [...tasks]
    .filter((task) => {
      if (activeFilter === 'pending') {
        return !task.completed
      }

      if (activeFilter === 'completed') {
        return task.completed
      }

      return true
    })
    .sort((firstTask, secondTask) => {
      const dateComparison = firstTask.dueDate.localeCompare(
        secondTask.dueDate,
      )

      return dateComparison !== 0
        ? dateComparison
        : firstTask.time.localeCompare(secondTask.time)
    })

  const pendingTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <>
      <section className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#17211b]">
              Minhas tarefas
            </h1>

            <p className="mt-2 text-[#667069]">
              Organize todas as suas atividades em um só lugar.
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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e4ebe5] bg-white p-5">
            <p className="text-sm text-[#7b847e]">Total</p>
            <strong className="mt-1 block text-2xl text-[#17211b]">
              {tasks.length}
            </strong>
          </div>

          <div className="rounded-2xl border border-[#e4ebe5] bg-white p-5">
            <p className="text-sm text-[#7b847e]">Pendentes</p>
            <strong className="mt-1 block text-2xl text-[#b06b24]">
              {pendingTasks}
            </strong>
          </div>

          <div className="rounded-2xl border border-[#e4ebe5] bg-white p-5">
            <p className="text-sm text-[#7b847e]">Concluídas</p>
            <strong className="mt-1 block text-2xl text-[#23834b]">
              {completedTasks}
            </strong>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
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

        <div className="mt-6 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cfd8d1] bg-white px-6 py-12 text-center">
              <p className="font-medium text-[#27312b]">
                Nenhuma tarefa encontrada
              </p>

              <p className="mt-1 text-sm text-[#8a938d]">
                Experimente outro filtro ou crie uma nova tarefa.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
              />
            ))
          )}
        </div>
      </section>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTask={createTask}
      />
    </>
  )
}