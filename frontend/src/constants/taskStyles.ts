import type {
  TaskPriority,
} from '../types/taskTypes'

export const priorityLabels: Record<
  TaskPriority,
  string
> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export const priorityStyles: Record<
  TaskPriority,
  string
> = {
  low:
    'bg-emerald-500/10 text-emerald-500',
  medium:
    'bg-amber-500/10 text-amber-500',
  high:
    'bg-red-500/10 text-red-500',
}