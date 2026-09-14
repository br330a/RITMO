import { useState } from 'react'
import {
  Check,
  ListTodo,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { categoryStyles } from '../../constants/categoryStyles'
import type { Task } from '../../types/task'

type TaskListProps = {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function TaskList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  const [openMenuTaskId, setOpenMenuTaskId] =
    useState<string | null>(null)

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

      {tasks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-medium text-[#27312b]">
            Nenhuma tarefa para hoje
          </p>

          <p className="mt-1 text-sm text-[#8a938d]">
            Aproveite o dia ou crie uma nova tarefa.
          </p>
        </div>
      ) : (
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
                {task.completed && (
                  <Check size={17} strokeWidth={2.5} />
                )}
              </button>

              <span className="text-sm text-[#8a938d]">
                {task.time}
              </span>

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

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuTaskId((currentId) =>
                      currentId === task.id ? null : task.id,
                    )
                  }
                  aria-label={`Ações para ${task.title}`}
                  aria-expanded={openMenuTaskId === task.id}
                  className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8a938d] hover:bg-[#f3f7f3]"
                >
                  <MoreHorizontal size={18} />
                </button>

                {openMenuTaskId === task.id && (
                  <div className="absolute top-10 right-0 z-20 w-36 rounded-xl border border-[#e4ebe5] bg-white p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onEditTask(task)
                        setOpenMenuTaskId(null)
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#27312b] hover:bg-[#f3f7f3]"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onDeleteTask(task)
                        setOpenMenuTaskId(null)
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}