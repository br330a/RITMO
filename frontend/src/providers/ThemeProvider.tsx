import {
  useEffect,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { ThemeContext } from '../context/themeContext'
import { useAuth } from '../hooks/useAuth'
import {
  getStoredAccentColor,
  getStoredTheme,
  saveAccentColor,
  saveTheme,
} from '../services/themeStorage'
import type {
  AccentColor,
  Theme,
} from '../types/themeTypes'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const {
    user,
    updateThemePreference,
    updateAccentColorPreference,
  } = useAuth()

  const theme: Theme =
    user?.theme ??
    getStoredTheme()

  const accentColor: AccentColor =
    user?.accentColor ??
    getStoredAccentColor()

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme

    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.accent =
      accentColor

    saveAccentColor(accentColor)
  }, [accentColor])

  function setTheme(
    newTheme: Theme,
  ) {
    if (!user) {
      return
    }

    void updateThemePreference(
      newTheme,
    ).catch(() => {
      toast.error(
        'Não foi possível salvar o tema.',
      )
    })
  }

  function setAccentColor(
    newAccentColor: AccentColor,
  ) {
    if (!user) {
      return
    }

    void updateAccentColorPreference(
      newAccentColor,
    ).catch(() => {
      toast.error(
        'Não foi possível salvar a cor.',
      )
    })
  }

  const value = {
    theme,
    accentColor,
    setTheme,
    setAccentColor,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}