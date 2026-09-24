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
  ) => boolean
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

  const isEditing = Boolean(category)

  function handleSubmit(
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

    const success = onSubmit({
      name: normalizedName,
      color,
      icon,
    })

    if (success) {
      onClose()
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-7 shadow-xl"
      >
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="category-form-title"
              className="text-2xl font-semibold text-[#17211b]"
            >
              {isEditing
                ? 'Editar categoria'
                : 'Nova categoria'}
            </h2>

            <p className="mt-1 text-sm text-[#7b847e]">
              Personalize como essa área aparece no RITMO.
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#27312b]">
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
              className="w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#27312b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#dcefe1]"
            />
          </label>

          <div>
            <p className="mb-3 text-sm font-medium text-[#27312b]">
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
                        ? 'border-[#23834b] ring-2 ring-[#dcefe1]'
                        : 'border-[#e1e7e2] hover:border-[#b9c6bc]',
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
            <p className="mb-3 text-sm font-medium text-[#27312b]">
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
                          ' border-[#23834b] ring-2 ring-[#dcefe1]'
                        : 'border-[#e1e7e2] bg-white text-[#667069] hover:bg-[#f7faf7]',
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

          <div className="rounded-xl bg-[#f7faf7] p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-[#8a938d] uppercase">
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

              <span className="font-semibold text-[#27312b]">
                {name.trim() ||
                  'Nova categoria'}
              </span>
            </div>
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
              {isEditing
                ? 'Salvar alterações'
                : 'Criar categoria'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}