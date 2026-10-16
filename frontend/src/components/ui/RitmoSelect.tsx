import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Check,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'

export type RitmoSelectOption = {
  value: string
  label: string
  icon?: LucideIcon
  iconClassName?: string
}

type RitmoSelectProps = {
  value: string
  options: RitmoSelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel: string
}

export function RitmoSelect({
  value,
  options,
  onChange,
  placeholder = 'Selecione',
  ariaLabel,
}: RitmoSelectProps) {
  const [isOpen, setIsOpen] =
    useState(false)

  const containerRef =
    useRef<HTMLDivElement>(null)

  const selectedOption =
    options.find(
      (option) =>
        option.value === value,
    )

  useEffect(() => {
    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
      true,
    )

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
        true,
      )

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [])

  function selectOption(
    optionValue: string,
  ) {
    onChange(optionValue)
    setIsOpen(false)
  }

  const SelectedIcon =
    selectedOption?.icon

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current,
          )
        }
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={[
          'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
          isOpen
            ? 'border-[var(--primary)] ring-2 ring-[var(--primary-soft)]'
            : 'border-[var(--border)] hover:border-[var(--text-muted)]',
          'bg-[var(--surface)] text-[var(--text-strong)]',
        ].join(' ')}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {SelectedIcon && (
            <span
              className={[
                'grid size-7 shrink-0 place-items-center rounded-lg',
                selectedOption
                  ?.iconClassName ??
                  'bg-[var(--surface-soft)] text-[var(--text-secondary)]',
              ].join(' ')}
            >
              <SelectedIcon size={15} />
            </span>
          )}

          <span
            className={[
              'truncate',
              selectedOption
                ? ''
                : 'text-[var(--text-muted)]',
            ].join(' ')}
          >
            {selectedOption?.label ??
              placeholder}
          </span>
        </span>

        <ChevronDown
          size={17}
          className={[
            'shrink-0 text-[var(--text-muted)] transition-transform',
            isOpen
              ? 'rotate-180'
              : '',
          ].join(' ')}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected =
              option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  selectOption(
                    option.value,
                  )
                }
                className={[
                  'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                  isSelected
                    ? 'bg-[var(--primary-soft)] text-[var(--primary-strong)]'
                    : 'text-[var(--text-strong)] hover:bg-[var(--surface-hover)]',
                ].join(' ')}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {Icon && (
                    <span
                      className={[
                        'grid size-7 shrink-0 place-items-center rounded-lg',
                        option.iconClassName ??
                          'bg-[var(--surface-soft)] text-[var(--text-secondary)]',
                      ].join(' ')}
                    >
                      <Icon size={15} />
                    </span>
                  )}

                  <span className="truncate">
                    {option.label}
                  </span>
                </span>

                {isSelected && (
                  <Check
                    size={16}
                    className="shrink-0"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}