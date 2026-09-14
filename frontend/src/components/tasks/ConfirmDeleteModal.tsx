import { Trash2, X } from 'lucide-react'

type ConfirmDeleteModalProps = {
  taskTitle: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({
  taskTitle,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
      onMouseDown={onCancel}
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-5"
    >
      <section
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-600">
            <Trash2 size={22} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[#667069] hover:bg-[#f3f7f3]"
          >
            <X size={20} />
          </button>
        </header>

        <h2
          id="delete-task-title"
          className="mt-5 text-xl font-semibold text-[#17211b]"
        >
          Excluir tarefa?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667069]">
          A tarefa <strong>“{taskTitle}”</strong> será removida
          permanentemente.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-[#dce4dd] px-5 py-3 text-sm font-semibold text-[#667069] hover:bg-[#f7faf7]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </section>
    </div>
  )
}