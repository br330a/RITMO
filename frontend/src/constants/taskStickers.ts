import type {
  TaskSticker,
} from '../types/taskTypes'

export type TaskStickerOption = {
  value: TaskSticker
  emoji: string
  label: string
}

export const taskStickerOptions:
  TaskStickerOption[] = [
    {
      value: 'star',
      emoji: '⭐',
      label: 'Estrela',
    },
    {
      value: 'heart',
      emoji: '💖',
      label: 'Coração',
    },
    {
      value: 'flower',
      emoji: '🌸',
      label: 'Flor',
    },
    {
      value: 'coffee',
      emoji: '☕',
      label: 'Café',
    },
    {
      value: 'book',
      emoji: '📚',
      label: 'Livros',
    },
    {
      value: 'headphones',
      emoji: '🎧',
      label: 'Fone',
    },
    {
      value: 'game',
      emoji: '🎮',
      label: 'Jogo',
    },
    {
      value: 'fire',
      emoji: '🔥',
      label: 'Fogo',
    },
    {
      value: 'sparkles',
      emoji: '✨',
      label: 'Brilhos',
    },
    {
      value: 'moon',
      emoji: '🌙',
      label: 'Lua',
    },
    {
      value: 'paw',
      emoji: '🐾',
      label: 'Patinha',
    },
    {
      value: 'clover',
      emoji: '🍀',
      label: 'Trevo',
    },
  ]

export function getTaskSticker(
  sticker: TaskSticker | null | undefined,
) {
  if (!sticker) {
    return null
  }

  return (
    taskStickerOptions.find(
      (option) =>
        option.value === sticker,
    ) ?? null
  )
}