import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type RitmoDatePickerProps = {
  value: string
  onChange: (value: string) => void
  min?: string
  ariaLabel: string
}

const weekDays = [
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
  'Dom',
]

function parseDate(
  value: string,
) {
  const [year, month, day] =
    value.split('-').map(Number)

  return new Date(
    year,
    month - 1,
    day,
  )
}

function formatValue(
  date: Date,
) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDisplayDate(
  value: string,
) {
  if (!value) {
    return 'Selecione uma data'
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
  ).format(parseDate(value))
}

function capitalize(
  value: string,
) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}

export function RitmoDatePicker({
  value,
  onChange,
  min,
  ariaLabel,
}: RitmoDatePickerProps) {
  const containerRef =
    useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] =
    useState(false)

  const [visibleDate, setVisibleDate] =
    useState(() =>
      value
        ? parseDate(value)
        : new Date(),
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

  const year =
    visibleDate.getFullYear()

  const month =
    visibleDate.getMonth()

  const firstDay =
    new Date(
      year,
      month,
      1,
    ).getDay()

  const mondayOffset =
    (firstDay + 6) % 7

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
    ).getDate()

  const cells = [
    ...Array(mondayOffset).fill(
      null,
    ),
    ...Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    ),
  ]

  function togglePicker() {
    if (!isOpen) {
        setVisibleDate(
        value
            ? parseDate(value)
            : new Date(),
        )
    }

    setIsOpen(
        (current) => !current,
    )
    }

  function changeMonth(
    amount: number,
  ) {
    setVisibleDate(
      new Date(
        year,
        month + amount,
        1,
      ),
    )
  }

  function selectDay(
    day: number,
  ) {
    const selectedValue =
      formatValue(
        new Date(
          year,
          month,
          day,
        ),
      )

    if (
      min &&
      selectedValue < min
    ) {
      return
    }

    onChange(selectedValue)
    setIsOpen(false)
  }

  const monthLabel =
    capitalize(
      new Intl.DateTimeFormat(
        'pt-BR',
        {
          month: 'long',
          year: 'numeric',
        },
      ).format(visibleDate),
    )

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={togglePicker}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={[
          'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition',
          isOpen
            ? 'border-[var(--primary)] ring-2 ring-[var(--primary-soft)]'
            : 'border-[var(--border)] hover:border-[var(--text-muted)]',
          'bg-[var(--surface)] text-[var(--text-strong)]',
        ].join(' ')}
      >
        <span>
          {formatDisplayDate(value)}
        </span>

        <CalendarDays
          size={17}
          className="text-[var(--text-muted)]"
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[310px] max-w-[calc(100vw-3rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                changeMonth(-1)
              }
              className="grid size-9 cursor-pointer place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              <ChevronLeft
                size={18}
              />
            </button>

            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {monthLabel}
            </p>

            <button
              type="button"
              onClick={() =>
                changeMonth(1)
              }
              className="grid size-9 cursor-pointer place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              <ChevronRight
                size={18}
              />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7">
            {weekDays.map(
              (day) => (
                <span
                  key={day}
                  className="py-1 text-center text-[11px] font-semibold text-[var(--text-muted)]"
                >
                  {day}
                </span>
              ),
            )}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map(
              (day, index) => {
                if (!day) {
                  return (
                    <span
                      key={`empty-${index}`}
                      className="size-9"
                    />
                  )
                }

                const dayValue =
                  formatValue(
                    new Date(
                      year,
                      month,
                      day,
                    ),
                  )

                const isSelected =
                  dayValue === value

                const isToday =
                  dayValue ===
                  formatValue(
                    new Date(),
                  )

                const isDisabled =
                  Boolean(
                    min &&
                      dayValue <
                        min,
                  )

                return (
                  <button
                    key={dayValue}
                    type="button"
                    disabled={
                      isDisabled
                    }
                    onClick={() =>
                      selectDay(day)
                    }
                    className={[
                      'grid size-9 place-items-center rounded-xl text-sm transition-colors',
                      isDisabled
                        ? 'cursor-not-allowed text-[var(--text-faint)] opacity-35'
                        : 'cursor-pointer',
                      isSelected
                        ? 'bg-[var(--primary)] font-semibold text-white'
                        : 'text-[var(--text-strong)] hover:bg-[var(--surface-hover)]',
                      isToday &&
                      !isSelected
                        ? 'font-semibold text-[var(--primary)]'
                        : '',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                )
              },
            )}
          </div>
        </div>
      )}
    </div>
  )
}