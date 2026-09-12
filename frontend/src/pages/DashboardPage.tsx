import { useState } from 'react'
import { Plus } from 'lucide-react'
import { NewTaskModal } from '../components/dashboard/NewTaskModal'
import { TaskList } from '../components/dashboard/TaskList'
import { UpcomingTasks } from '../components/dashboard/UpcomingTasks'
import { WeekOverview } from '../components/dashboard/WeekOverview'
import { useTasks } from '../hooks/useTasks'
import { getLocalDateValue } from '../utils/date'

export function DashboardPage() {
  const { tasks, createTask, toggleTask } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = getLocalDateValue()
  const todayTasks = tasks.filter((task) => task.dueDate === today)

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
            tasks={todayTasks}
            onToggleTask={toggleTask}
          />

          <aside className="flex flex-col gap-6">
            <WeekOverview />
            <UpcomingTasks />
          </aside>
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