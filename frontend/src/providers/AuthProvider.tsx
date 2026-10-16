import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AuthContext } from '../context/authContext'
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService'
import {
  getStoredAuthToken,
  removeAuthToken,
  saveAuthToken,
} from '../services/authStorage'
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '../types/authTypes'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [initialToken] = useState(() =>
    getStoredAuthToken(),
  )

  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(
    initialToken,
  )
  const [isLoading, setIsLoading] = useState(
    Boolean(initialToken),
  )

  useEffect(() => {
    if (!initialToken) {
      return
    }

    getCurrentUser(initialToken)
      .then((currentUser) => {
        setUser(currentUser)
        setToken(initialToken)
      })
      .catch(() => {
        removeAuthToken()
        setUser(null)
        setToken(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [initialToken])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginUser(credentials)

      saveAuthToken(response.token)

      setToken(response.token)
      setUser(response.user)
    },
    [],
  )

  const register = useCallback(
    async (data: RegisterData) => {
      await registerUser(data)

      await login({
        email: data.email,
        password: data.password,
      })
    },
    [login],
  )

  const logout = useCallback(() => {
    removeAuthToken()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      logout,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}