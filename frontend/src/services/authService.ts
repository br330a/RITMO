import { apiRequest } from './apiClient'
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types/authTypes'
import type {
  AccentColor,
  Theme,
} from '../types/themeTypes'

export function loginUser(
  credentials: LoginCredentials,
) {
  return apiRequest<AuthResponse>(
    '/api/auth/login',
    {
      method: 'POST',
      body: credentials,
    },
  )
}

export function registerUser(
  data: RegisterData,
) {
  return apiRequest<AuthUser>(
    '/api/auth/register',
    {
      method: 'POST',
      body: data,
    },
  )
}

export function getCurrentUser(
  token: string,
) {
  return apiRequest<AuthUser>(
    '/api/users/me',
    {
      token,
    },
  )
}

export function updateUserTheme(
  token: string,
  theme: Theme,
) {
  return apiRequest<AuthUser>(
    '/api/users/me/theme',
    {
      method: 'PATCH',
      token,
      body: {
        theme,
      },
    },
  )
}

export function updateUserAccentColor(
  token: string,
  accentColor: AccentColor,
) {
  return apiRequest<AuthUser>(
    '/api/users/me/accent-color',
    {
      method: 'PATCH',
      token,
      body: {
        accentColor,
      },
    },
  )
}