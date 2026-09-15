import { CalendarDays } from 'lucide-react'
import { getLocalDateValue } from '../../utils/date'

type WeekOverviewProps = {
  selectedDate: string
  onSelectDate: (date: string) => void
}

function getCurrentWeek() {
  const today = new Date()
  const currentDay = today.getDay()
  const mondayDifference = currentDay === 0 ? -6 : 1 - currentDay

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)

    date.setDate(today.getDate() + mondayDifference + index)

    const weekday = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
    })
      .format(date)
      .replace('.', '')

    return {
      date,
      dateValue: getLocalDateValue(date),
      weekday,
      dayNumber: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    }
  })
}

export function WeekOverview({
  selectedDate,
  onSelectDate,
}: WeekOverviewProps) {
  const weekDays = getCurrentWeek()

  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center gap-3">
        <CalendarDays size={22} className="text-[#19683a]" />

        <h2 className="text-xl font-semibold text-[#17211b]">
          Esta semana
        </h2>
      </header>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isSelected = day.dateValue === selectedDate

          return (
            <button
              key={day.dateValue}
              type="button"
              onClick={() => onSelectDate(day.dateValue)}
              aria-label={`Mostrar tarefas de ${day.date.toLocaleDateString('pt-BR')}`}
              aria-pressed={isSelected}
              aria-current={day.isToday ? 'date' : undefined}
              className={[
                'flex min-w-0 cursor-pointer flex-col items-center rounded-xl px-1 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23834b]',
                isSelected
                  ? 'bg-[#e4f3e8] text-[#19683a]'
                  : 'text-[#667069] hover:bg-[#f0f6f1]',
              ].join(' ')}
            >
              <span className="text-xs capitalize">
                {day.weekday}
              </span>

              <span className="mt-2 text-sm font-semibold">
                {day.dayNumber}
              </span>

              <span
                aria-hidden="true"
                className={[
                  'mt-2 size-1.5 rounded-full',
                  day.isToday ? 'bg-[#23834b]' : 'bg-[#cbd2cd]',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>
    </article>
  )
}