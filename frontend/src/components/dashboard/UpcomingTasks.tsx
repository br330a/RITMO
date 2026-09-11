import { ArrowRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router'
import { categoryStyles } from '../../constants/categoryStyles'
import type { TaskCategory } from '../../types/task'

type UpcomingTask = {
  id: number
  title: string
  dateLabel: string
  category: TaskCategory
}

const upcomingTasks: UpcomingTask[] = [
  {
    id: 1,
    title: 'Trabalho em grupo',
    dateLabel: 'Amanhã, 09:00',
    category: 'Faculdade',
  },
  {
    id: 2,
    title: 'Treino na academia',
    dateLabel: 'Sábado, 15:00',
    category: 'Saúde',
  },
]

export function UpcomingTasks() {
  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
      <header className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock3 size={22} className="text-[#19683a]" />

          <h2 className="text-xl font-semibold text-[#17211b]">
            Próximas tarefas
          </h2>
        </div>

        <Link
          to="/tarefas"
          className="flex items-center gap-1 text-xs font-semibold text-[#19683a] hover:underline"
        >
          Ver todas
          <ArrowRight size={14} />
        </Link>
      </header>

      <div>
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            className="border-b border-[#edf1ed] py-4 last:border-none last:pb-0"
          >
            <p className="text-xs text-[#8a938d]">{task.dateLabel}</p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-medium text-[#27312b]">
                {task.title}
              </p>

              <span
                className={[
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                  categoryStyles[task.category],
                ].join(' ')}
              >
                {task.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}