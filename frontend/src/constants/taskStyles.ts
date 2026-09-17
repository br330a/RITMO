import type { TaskPriority } from '../types/task'

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-[#edf5ef] text-[#52705a]',
  medium: 'bg-[#fff3dc] text-[#96651f]',
  high: 'bg-[#fde8e8] text-[#b33a3a]',
}