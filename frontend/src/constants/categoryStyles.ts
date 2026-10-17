import type {
  CategoryColor,
} from '../types/categoryTypes'

export const categoryColorStyles: Record<
  CategoryColor,
  string
> = {
  green:
    'bg-emerald-500/10 text-emerald-500',
  blue:
    'bg-blue-500/10 text-blue-500',
  purple:
    'bg-purple-500/10 text-purple-500',
  orange:
    'bg-orange-500/10 text-orange-500',
  red:
    'bg-red-500/10 text-red-500',
  teal:
    'bg-teal-500/10 text-teal-500',
}

export const categoryProgressStyles: Record<
  CategoryColor,
  string
> = {
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
}