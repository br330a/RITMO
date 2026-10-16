import type { Category } from '../types/categoryTypes'

type LegacyCategory = Omit<Category, 'createdAt'>

export const initialCategories: LegacyCategory[] = [
  {
    id: 'faculdade',
    name: 'Faculdade',
    color: 'green',
    icon: 'graduation',
  },
  {
    id: 'pessoal',
    name: 'Pessoal',
    color: 'blue',
    icon: 'user',
  },
  {
    id: 'saude',
    name: 'Saúde',
    color: 'purple',
    icon: 'health',
  },
]