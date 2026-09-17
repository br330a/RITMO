import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type {
  CreateTaskData,
  Task,
  TaskCategory,
  TaskPriority,
} from '../../types/taskTypes'
import { getLocalDateValue } from '../../utils/date'
import { toast } from 'sonner'

type TaskFormModalProps = {
  task?: Task
  onClose: () => void
  onSubmit: (taskData: CreateTaskData) => void
  initialDate?: string
}

const categories: TaskCategory[] = [
  'Faculdade',
  'Pessoal',
  'Saúde',
]

const priorities: {
  value: TaskPriority
  label: string
}[] = [
  {
    value: 'low',
    label: 'Baixa',
  },
  {
    value: 'medium',
    label: 'Média',
  },
  {
    value: 'high',
    label: 'Alta',
  },
]

const durationOptions = [
  {
    value: '15',
    label: '15 min',
  },
  {
    value: '30',
    label: '30 min',
  },
  {
    value: '45',
    label: '45 min',
  },
  {
    value: '60',
    label: '1 hora',
  },
  {
    value: '90',
    label: '1h 30min',
  },
  {
    value: '120',
    label: '2 horas',
  },
  {
    value: '180',
    label: '3 horas',
  },
]

const inputStyles =
  'w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]'

export function TaskFormModal({
  task,
  onClose,
  onSubmit,
  initialDate,
}: TaskFormModalProps) {
    const [title, setTitle] = useState(task?.title ?? '')

    const [dueDate, setDueDate] = useState(
      task?.dueDate ?? initialDate ?? getLocalDateValue()
    )

    const [time, setTime] = useState(task?.time ?? '')

    const [description, setDescription] = useState(
      task?.description ?? ''
    )

    const [priority, setPriority] = useState<TaskPriority>(
      task?.priority ?? 'medium'
    )

    const [estimatedMinutes, setEstimatedMinutes] = useState(
      task?.estimatedMinutes?.toString() ?? ''
    )

    const [category, setCategory] = useState<TaskCategory | ''>(
      task?.category ?? ''
    )

  const isEditing = Boolean(task)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      toast.error('Digite o nome da tarefa.')
      return
    }

    if (!dueDate) {
      toast.error('Selecione a data da tarefa.')
      return
    }

    if (!category) {
      toast.error('Selecione uma categoria.')
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      dueDate,
      time: time || null,
      category,
      priority,
      estimatedMinutes: estimatedMinutes
        ? Number(estimatedMinutes)
        : null,
    })

    toast.success(
      task ? 'Tarefa atualizada com sucesso.' : 'Tarefa criada com sucesso.'
    )

    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      onMouseDown={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-5"
    >
      <section
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-7 shadow-xl"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="task-form-title"
              className="text-2xl font-semibold text-[#17211b]"
            >
              {isEditing ? 'Editar tarefa' : 'Nova tarefa'}
            </h2>

            <p className="mt-1 text-sm text-[#7b847e]">
              {isEditing
                ? 'Atualize as informações da atividade.'
                : 'Organize uma nova atividade.'}
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

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#27312b]">
              Descrição (opcional)
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex.: Revisar orientação a objetos e fazer exercícios"
              rows={3}
              className={`${inputStyles} resize-none`}
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
                onChange={(event) => setDueDate(event.target.value)}
                className={inputStyles}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#27312b]">
                Horário (opcional)
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
                setCategory(event.target.value as TaskCategory | '')
              }
              className={inputStyles}
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>

              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#27312b]">
                Prioridade
              </span>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className={inputStyles}
              >
                {priorities.map((priorityOption) => (
                  <option
                    key={priorityOption.value}
                    value={priorityOption.value}
                  >
                    {priorityOption.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#27312b]">
                Duração estimada
              </span>

              <select
                value={estimatedMinutes}
                onChange={(event) =>
                  setEstimatedMinutes(event.target.value)
                }
                className={inputStyles}
              >
                <option value="">
                  Não informar
                </option>

                {durationOptions.map((duration) => (
                  <option
                    key={duration.value}
                    value={duration.value}
                  >
                    {duration.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
              {isEditing ? 'Salvar alterações' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}