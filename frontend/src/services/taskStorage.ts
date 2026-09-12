import type { Task } from '../types/task'

const STORAGE_KEY = 'ritmo:tasks'

export function loadTasks(): Task[] | null {
  const storedTasks = localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    return null
  }

  try {
    return JSON.parse(storedTasks) as Task[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}