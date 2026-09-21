import type { Task } from '../types/taskTypes'

const STORAGE_KEY = 'ritmo:tasks'

type StoredTask = Omit<
  Task,
  | 'description'
  | 'priority'
  | 'estimatedMinutes'
  | 'completedAt'
> &
  Partial<
    Pick<
      Task,
      | 'description'
      | 'priority'
      | 'estimatedMinutes'
      | 'completedAt'
    >
  >

export function loadTasks(): Task[] | null {
  const storedTasks = localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    return null
  }

  try {
    const parsedTasks =
      JSON.parse(storedTasks) as StoredTask[]

    return parsedTasks.map((task) => ({
      ...task,
      description: task.description ?? null,
      priority: task.priority ?? 'medium',
      estimatedMinutes:
        task.estimatedMinutes ?? null,
      completedAt: task.completed
        ? task.completedAt ??
          new Date().toISOString()
        : null,
    }))
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks),
  )
}