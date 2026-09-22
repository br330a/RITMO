export type TaskCategory =
  | 'Faculdade'
  | 'Pessoal'
  | 'Saúde'

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'

export type RecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'

export type TaskRecurrence = {
  frequency: RecurrenceFrequency
  daysOfWeek: number[]
  endDate: string | null
}

export type CompletedOccurrences = Record<
  string,
  string
>

export type Task = {
  id: string
  title: string
  description: string | null
  dueDate: string
  time: string | null

  category: string
  categoryId: string

  priority: TaskPriority
  estimatedMinutes: number | null

  recurrence: TaskRecurrence | null
  completedOccurrences: CompletedOccurrences

  completed: boolean
  completedAt: string | null
}

export type CreateTaskData = Omit<
  Task,
  | 'id'
  | 'completed'
  | 'completedAt'
  | 'completedOccurrences'
>