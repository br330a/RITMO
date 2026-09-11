import { Check, ListTodo, MoreHorizontal } from 'lucide-react'
import { categoryStyles } from '../../constants/categoryStyles'
import type { Task } from '../../types/task'

type TaskListProps = {
  tasks: Task[]
  onToggleTask: (taskId: number) => void
}


export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const completedTasks = tasks.filter((task) => task.completed).length
  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0

  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-7 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-[#edf1ed] pb-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-[#e4f3e8] text-[#19683a]">
            <ListTodo size={21} />
          </div>

          <h2 className="text-xl font-semibold text-[#17211b]">
            Suas tarefas de hoje
          </h2>
        </div>

        <div className="w-48">
          <p className="mb-2 text-sm text-[#667069]">
            {completedTasks} de {tasks.length} concluídas
          </p>

          <div className="h-2 overflow-hidden rounded-full bg-[#e7ece8]">
            <div
              className="h-full rounded-full bg-[#23834b] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[40px_65px_minmax(0,1fr)_auto_32px] items-center gap-3 border-b border-[#edf1ed] py-4 last:border-none"
          >
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              aria-label={
                task.completed
                  ? `Marcar ${task.title} como pendente`
                  : `Marcar ${task.title} como concluída`
              }
              className={[
                'grid size-7 cursor-pointer place-items-center rounded-full border transition-colors',
                task.completed
                  ? 'border-[#23834b] bg-[#23834b] text-white'
                  : 'border-[#aeb8b1] bg-white hover:border-[#23834b]',
              ].join(' ')}
            >
              {task.completed && <Check size={17} strokeWidth={2.5} />}
            </button>

            <span className="text-sm text-[#8a938d]">{task.time}</span>

            <span
              className={[
                'truncate text-sm font-medium',
                task.completed
                  ? 'text-[#9aa29d] line-through'
                  : 'text-[#27312b]',
              ].join(' ')}
            >
              {task.title}
            </span>

            <span
              className={[
                'rounded-full px-3 py-1 text-xs font-medium',
                categoryStyles[task.category],
              ].join(' ')}
            >
              {task.category}
            </span>

            <button
              type="button"
              aria-label={`Mais opções para ${task.title}`}
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8a938d] hover:bg-[#f3f7f3]"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}