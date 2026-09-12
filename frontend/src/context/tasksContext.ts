import { createContext } from 'react'
import type { CreateTaskData, Task } from '../types/task'

export type TasksContextValue = {
  tasks: Task[]
  createTask: (task: CreateTaskData) => void
  toggleTask: (taskId: string) => void
}

export const TasksContext = createContext<TasksContextValue | undefined>(
  undefined,
)