import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Trash2,
} from 'lucide-react'
import { categoryStyles } from '../../constants/categoryStyles'
import type { Task } from '../../types/task'
import { formatTaskDate } from '../../utils/date'

type TaskCardProps = {
  task: Task
  onToggle: (taskId: string) => void
  onDelete: (task: Task) => void
  onEdit: (task: Task) => void
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#e4ebe5] bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={
          task.completed
            ? `Marcar ${task.title} como pendente`
            : `Marcar ${task.title} como concluída`
        }
        className={[
          'grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors',
          task.completed
            ? 'border-[#23834b] bg-[#23834b] text-white'
            : 'border-[#aeb8b1] bg-white hover:border-[#23834b]',
        ].join(' ')}
      >
        {task.completed && <Check size={18} strokeWidth={2.5} />}
      </button>

      <div className="min-w-0 flex-1">
        <h2
          className={[
            'truncate font-semibold',
            task.completed
              ? 'text-[#9aa29d] line-through'
              : 'text-[#27312b]',
          ].join(' ')}
        >
          {task.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#7b847e]">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatTaskDate(task.dueDate)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {task.time}
          </span>
        </div>
      </div>

      <span
        className={[
          'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
          categoryStyles[task.category],
        ].join(' ')}
      >
        {task.category}
      </span>

      <button
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Editar ${task.title}`}
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[#8a938d] transition-colors hover:bg-[#e4f3e8] hover:text-[#19683a]"
        >
        <Pencil size={18} />
        </button>

      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Excluir ${task.title}`}
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[#8a938d] transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}