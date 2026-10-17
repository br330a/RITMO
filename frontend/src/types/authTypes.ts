import type {
  AccentColor,
  Theme,
} from './themeTypes'

export type AuthUser = {
  id: number
  name: string
  email: string
  theme: Theme
  accentColor: AccentColor
  createdAt: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  token: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}