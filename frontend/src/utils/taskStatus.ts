import type { Task } from '../types/taskTypes'

export const COMPLETED_TASK_RETENTION_DAYS = 14

const DAY_IN_MILLISECONDS =
  24 * 60 * 60 * 1000

export function isTaskArchived(
  task: Task,
  currentDate = new Date(),
) {
  if (!task.completed || !task.completedAt) {
    return false
  }

  const completedDate =
    new Date(task.completedAt)

  if (Number.isNaN(completedDate.getTime())) {
    return false
  }

  const elapsedTime =
    currentDate.getTime() -
    completedDate.getTime()

  return (
    elapsedTime >
    COMPLETED_TASK_RETENTION_DAYS *
      DAY_IN_MILLISECONDS
  )
}