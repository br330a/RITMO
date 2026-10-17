import { createContext } from 'react'
import type {
  AccentColor,
  Theme,
} from '../types/themeTypes'

export type ThemeContextValue = {
  theme: Theme
  accentColor: AccentColor

  setTheme: (
    theme: Theme,
  ) => void

  setAccentColor: (
    accentColor: AccentColor,
  ) => void
}

export const ThemeContext =
  createContext<ThemeContextValue | null>(
    null,
  )