import type { Theme } from '../types/themeTypes'

const THEME_STORAGE_KEY = 'ritmo.ui.theme'

const validThemes: Theme[] = [
  'light',
  'dark',
]

export function getStoredTheme(): Theme {
  const storedTheme =
    localStorage.getItem(THEME_STORAGE_KEY)

  if (
    storedTheme &&
    validThemes.includes(
      storedTheme as Theme,
    )
  ) {
    return storedTheme as Theme
  }

  return 'light'
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(
    THEME_STORAGE_KEY,
    theme,
  )
}