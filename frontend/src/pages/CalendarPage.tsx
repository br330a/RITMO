import { useState } from 'react'
import { Check } from 'lucide-react'
import { MonthCalendar } from '../components/calendar/MonthCalendar'
import { categoryStyles } from '../constants/categoryStyles'
import { useTasks } from '../hooks/useTasks'
import { getLocalDateValue } from '../utils/date'

function formatSelectedDate(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function CalendarPage() {
  const { tasks, toggleTask } = useTasks()
  const [selectedDate, setSelectedDate] = useState(
    getLocalDateValue(),
  )
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(),
  )

  const selectedTasks = tasks
    .filter((task) => task.dueDate === selectedDate)
    .sort((firstTask, secondTask) =>
      firstTask.time.localeCompare(secondTask.time),
    )

  return (
    <section className="mx-auto max-w-[1500px]">
      <header>
        <h1 className="text-3xl font-bold text-[#17211b]">
          Calendário
        </h1>

        <p className="mt-2 text-[#667069]">
          Visualize sua rotina e selecione um dia.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <MonthCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          tasks={tasks}
          onMonthChange={setCurrentMonth}
          onSelectDate={setSelectedDate}
        />

        <aside className="rounded-2xl border border-[#e4ebe5] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold capitalize text-[#17211b]">
            {formatSelectedDate(selectedDate)}
          </h2>

          <p className="mt-1 text-sm text-[#8a938d]">
            {selectedTasks.length === 1
              ? '1 tarefa agendada'
              : `${selectedTasks.length} tarefas agendadas`}
          </p>

          {selectedTasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[#8a938d]">
                Nenhuma tarefa para este dia.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {selectedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-[#e4ebe5] p-4"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.completed
                          ? `Marcar ${task.title} como pendente`
                          : `Marcar ${task.title} como concluída`
                      }
                      className={[
                        'mt-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border',
                        task.completed
                          ? 'border-[#23834b] bg-[#23834b] text-white'
                          : 'border-[#aeb8b1]',
                      ].join(' ')}
                    >
                      {task.completed && (
                        <Check size={14} strokeWidth={2.5} />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          'text-sm font-medium',
                          task.completed
                            ? 'text-[#9aa29d] line-through'
                            : 'text-[#27312b]',
                        ].join(' ')}
                      >
                        {task.title}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-[#8a938d]">
                          {task.time}
                        </span>

                        <span
                          className={[
                            'rounded-full px-2.5 py-1 text-xs font-medium',
                            categoryStyles[task.category],
                          ].join(' ')}
                        >
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}