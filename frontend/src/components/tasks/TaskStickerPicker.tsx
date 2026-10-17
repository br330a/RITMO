import { Ban } from 'lucide-react'
import {
  taskStickerOptions,
} from '../../constants/taskStickers'
import type {
  TaskSticker,
} from '../../types/taskTypes'

type TaskStickerPickerProps = {
  value: TaskSticker | null
  onChange: (
    sticker: TaskSticker | null,
  ) => void
}

export function TaskStickerPicker({
  value,
  onChange,
}: TaskStickerPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-7">
      <button
        type="button"
        onClick={() =>
          onChange(null)
        }
        aria-label="Sem adesivo"
        title="Sem adesivo"
        aria-pressed={value === null}
        className={[
          'grid h-11 cursor-pointer place-items-center rounded-xl border transition-all',
          value === null
            ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-strong)] ring-1 ring-[var(--primary)]'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]',
        ].join(' ')}
      >
        <Ban size={17} />
      </button>

      {taskStickerOptions.map(
        (option) => {
          const isSelected =
            option.value === value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(
                  option.value,
                )
              }
              aria-label={
                option.label
              }
              title={option.label}
              aria-pressed={
                isSelected
              }
              className={[
                'grid h-11 cursor-pointer place-items-center rounded-xl border text-xl transition-all',
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] ring-1 ring-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]',
              ].join(' ')}
            >
              {option.emoji}
            </button>
          )
        },
      )}
    </div>
  )
}