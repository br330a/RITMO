import { useState } from 'react'
import { Clock3, X } from 'lucide-react'
import { normalizeTime, formatWhileTyping } from '../../utils/time'

type RitmoTimeInputProps = {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

export function RitmoTimeInput({
  value,
  onChange,
  ariaLabel,
}: RitmoTimeInputProps) {
  const [hasError, setHasError] = useState(false)

  function handleChange(rawValue: string) {
    onChange(formatWhileTyping(rawValue))
    setHasError(false)
  }

  function handleBlur() {
    const normalized = normalizeTime(value)

    if (normalized === null) {
      setHasError(true)
      return
    }

    onChange(normalized)
    setHasError(false)
  }

  function clearTime() {
    onChange('')
    setHasError(false)
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
          aria-hidden="true"
          className="ml-4 shrink-0 text-[var(--text-muted)]"
        />

        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={5}
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          placeholder="HH:MM"
          aria-label={ariaLabel}
          aria-invalid={hasError}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)]"
        />

        {value && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearTime}
            aria-label="Remover horário"
            className="mr-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 text-xs text-red-500" role="alert">
          Digite um horário entre 00:00 e 23:59.
        </p>
      )}
    </div>
  )
}
