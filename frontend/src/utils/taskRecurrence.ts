import type { Task } from '../types/taskTypes'
import { getLocalDateValue } from './date'

function parseLocalDate(dateValue: string) {
    const [year, month, day] = dateValue
        .split('-')
        .map(Number)

    return new Date(year, month - 1, day)
}

function addDays(
    dateValue: string,
    amount: number,
) {
    const date = parseLocalDate(dateValue)

    date.setDate(date.getDate() + amount)

    return getLocalDateValue(date)
}

export function taskOccursOnDate(
    task: Task,
    dateValue: string,
) {
    if (!task.recurrence) {
        return task.dueDate === dateValue
    }

    if (dateValue < task.dueDate) {
        return false
    }

    if (
        task.recurrence.endDate &&
        dateValue > task.recurrence.endDate
    ) {
        return false
    }

    const date = parseLocalDate(dateValue)

    if (task.recurrence.frequency === 'daily') {
        return true
    }

    if (task.recurrence.frequency === 'weekly') {
        return task.recurrence.daysOfWeek.includes(
            date.getDay(),
        )
    }

    const startDate = parseLocalDate(task.dueDate)

    return date.getDate() === startDate.getDate()
}

export function getTaskOccurrence(
    task: Task,
    dateValue: string,
): Task {
    if (!task.recurrence) {
        return task
    }

    const completedAt =
        task.completedOccurrences[dateValue] ?? null

    return {
        ...task,
        dueDate: dateValue,
        completed: completedAt !== null,
        completedAt,
    }
}

export function getTasksForDate(
    tasks: Task[],
    dateValue: string,
) {
    return tasks
        .filter((task) =>
            taskOccursOnDate(task, dateValue),
        )
        .map((task) =>
            getTaskOccurrence(task, dateValue),
        )
}

export function getNextPendingOccurrence(
    task: Task,
    fromDate: string,
    includeFromDate = false,
): Task | null {
    if (!task.recurrence) {
        if (task.completed) {
            return null
        }

        const isValidDate = includeFromDate
            ? task.dueDate >= fromDate
            : task.dueDate > fromDate

        return isValidDate ? task : null
    }

    let currentDate = includeFromDate
        ? fromDate
        : addDays(fromDate, 1)

    const maximumSearchDays = 3660

    for (
        let index = 0;
        index < maximumSearchDays;
        index += 1
    ) {
        if (
            task.recurrence.endDate &&
            currentDate > task.recurrence.endDate
        ) {
            return null
        }

        if (
            taskOccursOnDate(task, currentDate) &&
            !task.completedOccurrences[currentDate]
        ) {
            return getTaskOccurrence(
                task,
                currentDate,
            )
        }

        currentDate = addDays(currentDate, 1)
    }

    return null
}

export function getCompletedOccurrences(
    task: Task,
) {
    if (!task.recurrence) {
        return task.completed ? [task] : []
    }

    return Object.entries(
        task.completedOccurrences,
    )
        .map(([dateValue]) =>
            getTaskOccurrence(task, dateValue),
        )
        .sort((firstTask, secondTask) =>
            secondTask.dueDate.localeCompare(
                firstTask.dueDate,
            ),
        )
}

const weekDayLabels: Record<
    number,
    string
> = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb',
}

export function formatTaskRecurrence(
    task: Task,
) {
    if (!task.recurrence) {
        return 'Não se repete'
    }

    if (
        task.recurrence.frequency === 'daily'
    ) {
        return 'Todos os dias'
    }

    if (
        task.recurrence.frequency === 'weekly'
    ) {
        const orderedDays = [
            1,
            2,
            3,
            4,
            5,
            6,
            0,
        ].filter((day) =>
            task.recurrence?.daysOfWeek.includes(
                day,
            ),
        )

        const labels = orderedDays.map(
            (day) => weekDayLabels[day],
        )

        return `Toda semana: ${labels.join(', ')}`
    }

    const dayOfMonth = Number(
        task.dueDate.split('-')[2],
    )

    return `Todo mês no dia ${dayOfMonth}`
}

export function formatRecurrenceEndDate(
    task: Task,
) {
    if (!task.recurrence?.endDate) {
        return 'Sem data final'
    }

    const [year, month, day] =
        task.recurrence.endDate
            .split('-')
            .map(Number)

    return new Intl.DateTimeFormat(
        'pt-BR',
    ).format(
        new Date(year, month - 1, day),
    )
}