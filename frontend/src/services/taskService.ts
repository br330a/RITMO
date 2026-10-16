import { apiRequest } from './apiClient'
import type {
  CreateTaskData,
  Task,
} from '../types/taskTypes'

export function getTasks(token: string) {
  return apiRequest<Task[]>('/api/tasks', {
    token,
  })
}

export function createTaskRequest(
  token: string,
  taskData: CreateTaskData,
) {
  return apiRequest<Task>('/api/tasks', {
    method: 'POST',
    token,
    body: taskData,
  })
}

export function updateTaskRequest(
  token: string,
  taskId: string,
  taskData: CreateTaskData,
) {
  return apiRequest<Task>(
    `/api/tasks/${taskId}`,
    {
      method: 'PUT',
      token,
      body: taskData,
    },
  )
}

export function deleteTaskRequest(
  token: string,
  taskId: string,
) {
  return apiRequest<void>(
    `/api/tasks/${taskId}`,
    {
      method: 'DELETE',
      token,
    },
  )
}

export function setTaskCompletionRequest(
  token: string,
  taskId: string,
  completed: boolean,
) {
  return apiRequest<Task>(
    `/api/tasks/${taskId}/completion`,
    {
      method: 'PATCH',
      token,
      body: {
        completed,
      },
    },
  )
}

export function completeTaskOccurrenceRequest(
  token: string,
  taskId: string,
  occurrenceDate: string,
) {
  return apiRequest<Task>(
    `/api/tasks/${taskId}/occurrences/${occurrenceDate}/complete`,
    {
      method: 'POST',
      token,
    },
  )
}

export function uncompleteTaskOccurrenceRequest(
  token: string,
  taskId: string,
  occurrenceDate: string,
) {
  return apiRequest<Task>(
    `/api/tasks/${taskId}/occurrences/${occurrenceDate}/complete`,
    {
      method: 'DELETE',
      token,
    },
  )
}