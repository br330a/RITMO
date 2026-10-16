import { createContext } from 'react'
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types/authTypes'
import type { Theme } from '../types/themeTypes'

export type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>

  register: (
    data: RegisterData,
  ) => Promise<void>

  updateThemePreference: (
    theme: Theme,
  ) => Promise<void>

  logout: () => void
}

export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  )