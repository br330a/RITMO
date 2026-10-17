export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'

export type RecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'

export type TaskSticker =
  | 'star'
  | 'heart'
  | 'flower'
  | 'coffee'
  | 'book'
  | 'headphones'
  | 'game'
  | 'fire'
  | 'sparkles'
  | 'moon'
  | 'paw'
  | 'clover'

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

  categoryId: string

  priority: TaskPriority
  estimatedMinutes: number | null
  sticker: TaskSticker | null

  recurrence: TaskRecurrence | null
  completedOccurrences: CompletedOccurrences

  completed: boolean
  completedAt: string | null
}

type BaseCreateTaskData = Omit<
  Task,
  | 'id'
  | 'completed'
  | 'completedAt'
  | 'completedOccurrences'
  | 'sticker'
>

export type CreateTaskData =
  BaseCreateTaskData & {
    sticker?: TaskSticker | null
  }