export type TaskCategory = 'Faculdade' | 'Pessoal' | 'Saúde'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string | null
  dueDate: string
  time: string | null
  category: TaskCategory
  priority: TaskPriority
  estimatedMinutes: number | null
  completed: boolean
}

export type CreateTaskData = Omit<Task, 'id' | 'completed'>