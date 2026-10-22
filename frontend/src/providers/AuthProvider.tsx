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
  updateUserAccentColor,
  updateUserTheme,
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
import type {
  AccentColor,
  Theme,
} from '../types/themeTypes'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [initialToken] = useState(() =>
    getStoredAuthToken(),
  )

  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [token, setToken] =
    useState<string | null>(
      initialToken,
    )

  const [isLoading, setIsLoading] =
    useState(
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
    async (
      credentials: LoginCredentials,
    ) => {
      const response =
        await loginUser(credentials)

      saveAuthToken(response.token)

      setToken(response.token)
      setUser(response.user)
    },
    [],
  )

  const register = useCallback(
    async (data: RegisterData) => {
      const response = await registerUser(data)

      saveAuthToken(response.token)
      setToken(response.token)
      setUser(response.user)
    },
    [],
  )

  const updateThemePreference =
    useCallback(
      async (theme: Theme) => {
        if (!token || !user) {
          throw new Error(
            'Sua sessão não está disponível.',
          )
        }

        const previousUser = user

        setUser({
          ...user,
          theme,
        })

        try {
          const updatedUser =
            await updateUserTheme(
              token,
              theme,
            )

          setUser(updatedUser)
        } catch (error) {
          setUser(previousUser)
          throw error
        }
      },
      [
        token,
        user,
      ],
    )

  const updateAccentColorPreference =
    useCallback(
      async (
        accentColor: AccentColor,
      ) => {
        if (!token || !user) {
          throw new Error(
            'Sua sessão não está disponível.',
          )
        }

        const previousUser = user

        setUser({
          ...user,
          accentColor,
        })

        try {
          const updatedUser =
            await updateUserAccentColor(
              token,
              accentColor,
            )

          setUser(updatedUser)
        } catch (error) {
          setUser(previousUser)
          throw error
        }
      },
      [
        token,
        user,
      ],
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
      isAuthenticated:
        Boolean(user && token),
      isLoading,
      login,
      register,
      updateThemePreference,
      updateAccentColorPreference,
      logout,
    }),
    [
      user,
      token,
      isLoading,
      login,
      register,
      updateThemePreference,
      updateAccentColorPreference,
      logout,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}