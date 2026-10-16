import {
  useState,
  type FormEvent,
} from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import {
  categoryColorStyles,
  categoryProgressStyles,
} from '../../constants/categoryStyles'
import {
  categoryIconLabels,
  categoryIcons,
} from '../../constants/categoryIcons'
import type {
  Category,
  CategoryColor,
  CategoryIcon,
  CreateCategoryData,
} from '../../types/categoryTypes'

type CategoryFormModalProps = {
  category?: Category
  onClose: () => void
  onSubmit: (
    categoryData: CreateCategoryData,
  ) => Promise<boolean>
}

const colors: CategoryColor[] = [
  'green',
  'blue',
  'purple',
  'orange',
  'red',
  'teal',
]

const icons: CategoryIcon[] = [
  'graduation',
  'user',
  'health',
  'work',
  'finance',
  'study',
  'home',
  'other',
]

export function CategoryFormModal({
  category,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState(
    category?.name ?? '',
  )

  const [color, setColor] =
    useState<CategoryColor>(
      category?.color ?? 'green',
    )

  const [icon, setIcon] =
    useState<CategoryIcon>(
      category?.icon ?? 'other',
    )

    const [isSubmitting, setIsSubmitting] =
      useState(false)

  const isEditing = Boolean(category)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedName = name.trim()

    if (!normalizedName) {
      toast.error(
        'Digite o nome da categoria.',
      )

      return
    }

    if (normalizedName.length > 30) {
      toast.error(
        'O nome da categoria deve ter no máximo 30 caracteres.',
      )

      return
    }

    setIsSubmitting(true)

    try {
      const success = await onSubmit({
        name: normalizedName,
        color,
        icon,
      })

      if (success) {
        onClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
      onMouseDown={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-5"
    >
      <section
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[var(--surface)] p-7 shadow-xl"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="category-form-title"
              className="text-2xl font-semibold text-[var(--text-primary)]"
            >
              {isEditing
                ? 'Editar categoria'
                : 'Nova categoria'}
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Personalize como essa área aparece no RITMO.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text-strong)]">
              Nome
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ex.: Academia"
              maxLength={30}
              autoFocus
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#dcefe1]"
            />
          </label>

          <div>
            <p className="mb-3 text-sm font-medium text-[var(--text-strong)]">
              Cor
            </p>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {colors.map(
                (colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() =>
                      setColor(
                        colorOption,
                      )
                    }
                    aria-pressed={
                      color === colorOption
                    }
                    className={[
                      'flex cursor-pointer items-center justify-center rounded-xl border p-3 transition-all',
                      color === colorOption
                        ? 'border-[var(--primary)] ring-2 ring-[#dcefe1]'
                        : 'border-[var(--border-soft)] hover:border-[var(--border)]',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'size-7 rounded-full',
                        categoryProgressStyles[
                          colorOption
                        ],
                      ].join(' ')}
                    />
                  </button>
                ),
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-[var(--text-strong)]">
              Ícone
            </p>

            <div className="grid grid-cols-4 gap-2">
              {icons.map((iconOption) => {
                const Icon =
                  categoryIcons[
                    iconOption
                  ]

                return (
                  <button
                    key={iconOption}
                    type="button"
                    onClick={() =>
                      setIcon(
                        iconOption,
                      )
                    }
                    aria-label={
                      categoryIconLabels[
                        iconOption
                      ]
                    }
                    aria-pressed={
                      icon === iconOption
                    }
                    title={
                      categoryIconLabels[
                        iconOption
                      ]
                    }
                    className={[
                      'grid min-h-16 cursor-pointer place-items-center rounded-xl border transition-all',
                      icon === iconOption
                        ? categoryColorStyles[
                            color
                          ] +
                          ' border-[var(--primary)] ring-2 ring-[#dcefe1]'
                        : 'border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]',
                    ].join(' ')}
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.8}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl bg-[var(--app-bg)] p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Prévia
            </p>

            <div className="flex items-center gap-3">
              <div
                className={[
                  'grid size-11 place-items-center rounded-xl',
                  categoryColorStyles[
                    color
                  ],
                ].join(' ')}
              >
                {(() => {
                  const PreviewIcon =
                    categoryIcons[icon]

                  return (
                    <PreviewIcon
                      size={21}
                      strokeWidth={1.8}
                    />
                  )
                })()}
              </div>

              <span className="font-semibold text-[var(--text-strong)]">
                {name.trim() ||
                  'Nova categoria'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar alterações'
                  : 'Criar categoria'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

