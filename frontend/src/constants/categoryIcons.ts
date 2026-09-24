import {
  BookOpen,
  Briefcase,
  Dumbbell,
  GraduationCap,
  House,
  Tags,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type {
  CategoryIcon,
} from '../types/categoryTypes'

export const categoryIcons: Record<
  CategoryIcon,
  LucideIcon
> = {
  graduation: GraduationCap,
  user: UserRound,
  health: Dumbbell,
  work: Briefcase,
  finance: Wallet,
  study: BookOpen,
  home: House,
  other: Tags,
}

export const categoryIconLabels: Record<
  CategoryIcon,
  string
> = {
  graduation: 'Faculdade',
  user: 'Pessoal',
  health: 'Saúde',
  work: 'Trabalho',
  finance: 'Finanças',
  study: 'Estudos',
  home: 'Casa',
  other: 'Outros',
}