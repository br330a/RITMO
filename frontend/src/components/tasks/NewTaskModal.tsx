import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { CreateTaskData, TaskCategory } from '../../types/task'
import { getLocalDateValue } from '../../utils/date'

type NewTaskModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: CreateTaskData) => void
}

const categories: TaskCategory[] = [
  'Faculdade',
  'Pessoal',
  'Saúde',
]

const inputStyles =
  'w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]'

export function NewTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: NewTaskModalProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(getLocalDateValue())
  const [time, setTime] = useState('')
  const [category, setCategory] =
    useState<TaskCategory>('Faculdade')

  if (!isOpen) {
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !dueDate || !time) {
      return
    }

    onCreateTask({
      title: title.trim(),
      dueDate,
      time,
      category,
    })

    setTitle('')
    setDueDate(getLocalDateValue())
    setTime('')
    setCategory('Faculdade')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-title"
      onMouseDown={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-5"
    >
      <section
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="new-task-title"
              className="text-2xl font-semibold text-[#17211b]"
            >
              Nova tarefa
            </h2>

            <p className="mt-1 text-sm text-[#7b847e]">
              Organize uma nova atividade.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#667069] hover:bg-[#f3f7f3]"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#27312b]">
              Tarefa
            </span>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Estudar Java"
              autoFocus
              className={inputStyles}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#27312b]">
                Data
              </span>

              <input
                type="date"
                value={dueDate}
                min={getLocalDateValue()}
                onChange={(event) => setDueDate(event.target.value)}
                className={inputStyles}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#27312b]">
                Horário
              </span>

              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className={inputStyles}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#27312b]">
              Categoria
            </span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TaskCategory)
              }
              className={inputStyles}
            >
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-[#dce4dd] px-5 py-3 text-sm font-semibold text-[#667069] hover:bg-[#f7faf7]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#23834b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19683a]"
            >
              Criar tarefa
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}