import type {
  CategoryColor,
} from '../types/categoryTypes'

export const categoryColorStyles: Record<
  CategoryColor,
  string
> = {
  green:
    'bg-[#e4f3e8] text-[#19683a]',
  blue:
    'bg-[#e7efff] text-[#315fa8]',
  purple:
    'bg-[#f0eafb] text-[#6f4ca5]',
  orange:
    'bg-[#fff0df] text-[#a85f21]',
  red:
    'bg-[#fde8e8] text-[#b33a3a]',
  teal:
    'bg-[#e1f3f0] text-[#24756b]',
}

/*
 * Temporário durante a migração.
 * Apagaremos quando nenhum componente usar task.category.
 */
export const categoryStyles: Record<
  string,
  string
> = {
  Faculdade:
    'bg-[#e4f3e8] text-[#19683a]',
  Pessoal:
    'bg-[#e7efff] text-[#315fa8]',
  Saúde:
    'bg-[#f0eafb] text-[#6f4ca5]',
}