import { CategoryCard } from '../components/categories/CategoryCard'
import { useTasks } from '../hooks/useTasks'
import type { TaskCategory } from '../types/taskTypes'

const categories: TaskCategory[] = [
  'Faculdade',
  'Pessoal',
  'Saúde',
]

export function CategoriesPage() {
  const { tasks } = useTasks()

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

  return (
    <section className="mx-auto max-w-[1200px]">
      <header>
        <h1 className="text-3xl font-bold text-[#17211b]">
          Categorias
        </h1>

        <p className="mt-2 text-[#667069]">
          Acompanhe suas tarefas por área da rotina.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
        <p className="text-sm text-[#7b847e]">Visão geral</p>

        <div className="mt-4 flex flex-wrap gap-8">
          <div>
            <strong className="block text-2xl text-[#17211b]">
              {tasks.length}
            </strong>
            <span className="text-sm text-[#8a938d]">
              Total de tarefas
            </span>
          </div>

          <div>
            <strong className="block text-2xl text-[#23834b]">
              {completedTasks}
            </strong>
            <span className="text-sm text-[#8a938d]">
              Concluídas
            </span>
          </div>

          <div>
            <strong className="block text-2xl text-[#b06b24]">
              {tasks.length - completedTasks}
            </strong>
            <span className="text-sm text-[#8a938d]">
              Pendentes
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            tasks={tasks}
          />
        ))}
      </div>
    </section>
  )
}