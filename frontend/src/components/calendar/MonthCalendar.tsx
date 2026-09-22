import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Task } from '../../types/taskTypes'
import { getLocalDateValue } from '../../utils/date'
import { getTasksForDate } from '../../utils/taskRecurrence'

type MonthCalendarProps = {
  currentMonth: Date
  selectedDate: string
  tasks: Task[]
  onMonthChange: (date: Date) => void
  onSelectDate: (date: string) => void
}

const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function getCalendarDays(currentMonth: Date) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstMonthDay = new Date(year, month, 1)
  const mondayIndex = (firstMonthDay.getDay() + 6) % 7
  const firstCalendarDay = new Date(year, month, 1 - mondayIndex)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCalendarDay)
    date.setDate(firstCalendarDay.getDate() + index)

    return date
  })
}

export function MonthCalendar({
  currentMonth,
  selectedDate,
  tasks,
  onMonthChange,
  onSelectDate,
}: MonthCalendarProps) {
  const calendarDays = getCalendarDays(currentMonth)
  const today = getLocalDateValue()

  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(currentMonth)

  function changeMonth(amount: number) {
    onMonthChange(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + amount,
        1,
      ),
    )
  }

  return (
    <article className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold capitalize text-[#17211b]">
          {monthLabel}
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Mês anterior"
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-[#dce4dd] text-[#667069] hover:bg-[#f3f7f3]"
          >
            <ChevronLeft size={19} />
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Próximo mês"
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-[#dce4dd] text-[#667069] hover:bg-[#f3f7f3]"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className="pb-3 text-center text-xs font-semibold text-[#8a938d]"
          >
            {weekday}
          </div>
        ))}

        {calendarDays.map((date) => {
          const dateValue = getLocalDateValue(date)
          const dayTasks = getTasksForDate(
            tasks,
            dateValue,
          )

          const isCurrentMonth =
            date.getMonth() === currentMonth.getMonth()
          const isSelected = dateValue === selectedDate
          const isToday = dateValue === today

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => onSelectDate(dateValue)}
              aria-label={`Selecionar dia ${date.getDate()}`}
              className={[
                'relative min-h-20 cursor-pointer border-t border-[#edf1ed] p-2 text-left transition-colors hover:bg-[#f7faf7]',
                isSelected ? 'bg-[#eaf5ed]' : '',
                isCurrentMonth
                  ? 'text-[#27312b]'
                  : 'text-[#b4bcb6]',
              ].join(' ')}
            >
              <span
                className={[
                  'grid size-7 place-items-center rounded-full text-sm',
                  isToday
                    ? 'bg-[#23834b] font-semibold text-white'
                    : '',
                ].join(' ')}
              >
                {date.getDate()}
              </span>

              {dayTasks.length > 0 && (
                <span className="absolute right-2 bottom-2 grid size-6 place-items-center rounded-full bg-[#dcefe1] text-xs font-semibold text-[#19683a]">
                  {dayTasks.length}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </article>
  )
}