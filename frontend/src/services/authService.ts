import { apiRequest } from './apiClient'
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types/authTypes'

export function loginUser(credentials: LoginCredentials) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function registerUser(data: RegisterData) {
  return apiRequest<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: data,
  })
}

export function getCurrentUser(token: string) {
  return apiRequest<AuthUser>('/api/users/me', {
    token,
  })
}