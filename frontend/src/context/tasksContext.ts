import { createContext } from 'react'
import type { CreateTaskData, Task } from '../types/taskTypes'

export type TasksContextValue = {
  tasks: Task[]
  createTask: (task: CreateTaskData) => void
  toggleTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
  updateTask: (taskId: string, taskData: CreateTaskData) => void
}

export const TasksContext = createContext<TasksContextValue | undefined>(
  undefined,
)