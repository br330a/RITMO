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
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#e4ebe5] bg-white p-5 shadow-sm">
      <h2
        className={[
          'break-words text-base font-semibold leading-6',
          task.completed
            ? 'text-[#9aa29d] line-through'
            : 'text-[#27312b]',
        ].join(' ')}
      >
        {task.title}
      </h2>

      <div className="mt-4 flex items-center gap-3 border-t border-[#edf1ed] pt-4">
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
          {task.completed && (
            <Check size={18} strokeWidth={2.5} />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#7b847e]">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {formatTaskDate(task.dueDate)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {task.time ?? 'Sem horário'}
          </span>

          <span
            className={[
              'rounded-full px-2.5 py-1 font-medium',
              categoryStyles[task.category],
            ].join(' ')}
          >
            {task.category}
          </span>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Editar ${task.title}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#8a938d] hover:bg-[#e4f3e8] hover:text-[#19683a]"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Excluir ${task.title}`}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#8a938d] hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  )
}