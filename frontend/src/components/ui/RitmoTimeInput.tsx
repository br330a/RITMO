import {
  useState,
} from 'react'
import {
  Clock3,
  X,
} from 'lucide-react'

type RitmoTimeInputProps = {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

function normalizeTime(
  value: string,
) {
  const trimmed =
    value.trim()

  if (!trimmed) {
    return ''
  }

  if (trimmed.includes(':')) {
    const [rawHour, rawMinute] =
      trimmed.split(':')

    const hour =
      Number(rawHour)

    const minute =
      Number(rawMinute)

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  const digits =
    trimmed.replace(/\D/g, '')

  if (
    digits.length === 3
  ) {
    const hour =
      Number(digits.slice(0, 1))

    const minute =
      Number(digits.slice(1))

    if (
      hour <= 23 &&
      minute <= 59
    ) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  if (
    digits.length === 4
  ) {
    const hour =
      Number(digits.slice(0, 2))

    const minute =
      Number(digits.slice(2))

    if (
      hour <= 23 &&
      minute <= 59
    ) {
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }

  return null
}

export function RitmoTimeInput({
  value,
  onChange,
  ariaLabel,
}: RitmoTimeInputProps) {
  const [draft, setDraft] =
    useState(value)

  const [hasError, setHasError] =
    useState(false)

  function handleChange(
    newValue: string,
  ) {
    const cleaned =
      newValue
        .replace(
          /[^0-9:]/g,
          '',
        )
        .slice(0, 5)

    setDraft(cleaned)
    setHasError(false)

    if (!cleaned) {
      onChange('')
    }

    const normalized =
      normalizeTime(cleaned)

    if (normalized) {
      onChange(normalized)
    }
  }

  function handleBlur() {
    if (!draft.trim()) {
      setDraft('')
      onChange('')
      setHasError(false)
      return
    }

    const normalized =
      normalizeTime(draft)

    if (!normalized) {
      setHasError(true)
      return
    }

    setDraft(normalized)
    onChange(normalized)
    setHasError(false)
  }

  function clearTime() {
    setDraft('')
    setHasError(false)
    onChange('')
  }

  return (
    <div>
      <div
        className={[
          'flex items-center rounded-xl border bg-[var(--surface)] transition',
          hasError
            ? 'border-red-500 ring-2 ring-red-500/10'
            : 'border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)] hover:border-[var(--text-muted)]',
        ].join(' ')}
      >
        <Clock3
          size={17}
          className="ml-4 shrink-0 text-[var(--text-muted)]"
        />

        <input
          type="text"
          inputMode="numeric"
          value={draft}
          onChange={(event) =>
            handleChange(
              event.target.value,
            )
          }
          onBlur={handleBlur}
          placeholder="HH:MM"
          aria-label={ariaLabel}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)]"
        />

        {draft && (
          <button
            type="button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={clearTime}
            aria-label="Remover horário"
            className="mr-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 text-xs text-red-500">
          Digite um horário válido.
        </p>
      )}
    </div>
  )
}