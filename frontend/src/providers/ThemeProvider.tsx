import {
  useEffect,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { ThemeContext } from '../context/themeContext'
import { useAuth } from '../hooks/useAuth'
import {
  getStoredTheme,
  saveTheme,
} from '../services/themeStorage'
import type {
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
  } = useAuth()

  const theme: Theme =
    user?.theme ??
    getStoredTheme()

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme

    saveTheme(theme)
  }, [theme])

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

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  )
}