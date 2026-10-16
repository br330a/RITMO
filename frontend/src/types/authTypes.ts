export type AuthUser = {
  id: number
  name: string
  email: string
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