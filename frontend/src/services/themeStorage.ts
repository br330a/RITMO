import type {
  AccentColor,
  Theme,
} from '../types/themeTypes'

const THEME_STORAGE_KEY =
  'ritmo.ui.theme'

const ACCENT_COLOR_STORAGE_KEY =
  'ritmo.ui.accent-color'

const validThemes: Theme[] = [
  'light',
  'dark',
]

const validAccentColors: AccentColor[] = [
  'green',
  'blue',
  'pink',
  'amber',
  'purple',
]

export function getStoredTheme(): Theme {
  const storedTheme =
    localStorage.getItem(
      THEME_STORAGE_KEY,
    )

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

export function getStoredAccentColor():
  AccentColor {
  const storedAccentColor =
    localStorage.getItem(
      ACCENT_COLOR_STORAGE_KEY,
    )

  if (
    storedAccentColor &&
    validAccentColors.includes(
      storedAccentColor as AccentColor,
    )
  ) {
    return storedAccentColor as AccentColor
  }

  return 'green'
}

export function saveTheme(
  theme: Theme,
) {
  localStorage.setItem(
    THEME_STORAGE_KEY,
    theme,
  )
}

export function saveAccentColor(
  accentColor: AccentColor,
) {
  localStorage.setItem(
    ACCENT_COLOR_STORAGE_KEY,
    accentColor,
  )
}