import { createContext } from 'react'
import type {
  CreateTaskData,
  Task,
} from '../types/taskTypes'

export type TasksContextValue = {
  tasks: Task[]
  isLoadingTasks: boolean

  createTask: (
    taskData: CreateTaskData,
  ) => Promise<boolean>

  updateTask: (
    taskId: string,
    taskData: CreateTaskData,
  ) => Promise<boolean>

  toggleTask: (
    taskId: string,
    occurrenceDate?: string,
  ) => Promise<boolean>

  deleteTask: (
    taskId: string,
  ) => Promise<boolean>
}

export const TasksContext =
  createContext<
    TasksContextValue | undefined
  >(undefined)