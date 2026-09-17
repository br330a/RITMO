import {
  ArrowRight,
  Dumbbell,
  GraduationCap,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import type { Task, TaskCategory } from '../../types/taskTypes'

type CategoryCardProps = {
  category: TaskCategory
  tasks: Task[]
}

type CategoryDetails = {
  icon: LucideIcon
  iconStyle: string
  progressStyle: string
}

const categoryDetails: Record<TaskCategory, CategoryDetails> = {
  Faculdade: {
    icon: GraduationCap,
    iconStyle: 'bg-[#e4f3e8] text-[#19683a]',
    progressStyle: 'bg-[#23834b]',
  },
  Pessoal: {
    icon: UserRound,
    iconStyle: 'bg-[#e7efff] text-[#315fa8]',
    progressStyle: 'bg-[#5b83c5]',
  },
  Saúde: {
    icon: Dumbbell,
    iconStyle: 'bg-[#f0eafb] text-[#6f4ca5]',
    progressStyle: 'bg-[#8968b8]',
  },
}

export function CategoryCard({
  category,
  tasks,
}: CategoryCardProps) {
  const details = categoryDetails[category]
  const Icon = details.icon

  const categoryTasks = tasks.filter(
    (task) => task.category === category,
  )
  const completedTasks = categoryTasks.filter(
    (task) => task.completed,
  ).length
  const pendingTasks = categoryTasks.length - completedTasks

  const progress = categoryTasks.length
    ? Math.round((completedTasks / categoryTasks.length) * 100)
    : 0

  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between">
        <div
          className={[
            'grid size-12 place-items-center rounded-xl',
            details.iconStyle,
          ].join(' ')}
        >
          <Icon size={23} strokeWidth={1.8} />
        </div>

        <span className="text-sm font-semibold text-[#8a938d]">
          {categoryTasks.length}{' '}
          {categoryTasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </header>

      <h2 className="mt-5 text-xl font-semibold text-[#17211b]">
        {category}
      </h2>

      <p className="mt-1 text-sm text-[#7b847e]">
        {pendingTasks === 1
          ? '1 tarefa pendente'
          : `${pendingTasks} tarefas pendentes`}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-[#8a938d]">Progresso</span>
          <span className="font-semibold text-[#27312b]">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#e7ece8]">
          <div
            className={[
              'h-full rounded-full transition-all',
              details.progressStyle,
            ].join(' ')}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link
        to="/tarefas"
        className="mt-6 flex items-center justify-between border-t border-[#edf1ed] pt-4 text-sm font-semibold text-[#19683a] hover:underline"
      >
        Ver tarefas
        <ArrowRight size={17} />
      </Link>
    </article>
  )
}