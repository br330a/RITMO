import type { Task } from '../types/taskTypes'
import { getLegacyCategoryId } from '../utils/categoryMigration'

const STORAGE_KEY = 'ritmo:tasks'

type StoredTask = Omit<
  Task,
  | 'description'
  | 'priority'
  | 'estimatedMinutes'
  | 'completedAt'
  | 'recurrence'
  | 'completedOccurrences'
  | 'categoryId'
> &
  Partial<
    Pick<
      Task,
      | 'description'
      | 'priority'
      | 'estimatedMinutes'
      | 'completedAt'
      | 'recurrence'
      | 'completedOccurrences'
      | 'categoryId'
    >
  > & {
    category?: string
  }

export function loadTasks(): Task[] | null {
  const storedTasks =
    localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    return null
  }

  try {
    const parsedTasks =
      JSON.parse(storedTasks) as StoredTask[]

    return parsedTasks.map((task) => {
      const {
        category: legacyCategory,
        ...storedTask
      } = task

      return {
        ...storedTask,

        description:
          storedTask.description ?? null,

        priority:
          storedTask.priority ?? 'medium',

        estimatedMinutes:
          storedTask.estimatedMinutes ??
          null,

        categoryId:
          storedTask.categoryId ??
          (legacyCategory
            ? getLegacyCategoryId(
                legacyCategory,
              )
            : 'sem-categoria'),

        recurrence:
          storedTask.recurrence ?? null,

        completedOccurrences:
          storedTask.completedOccurrences ??
          {},

        completedAt:
          storedTask.completed
            ? storedTask.completedAt ??
              new Date().toISOString()
            : null,
      }
    })
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