import {
  useState,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { RitmoLogo } from '../components/branding/RitmoLogo'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError(null)
    setIsSubmitting(true)

    try {
      await login({
        email,
        password,
      })

      toast.success('Login realizado com sucesso.')
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível entrar na sua conta.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center">
          <div className="flex items-center gap-3">
            <RitmoLogo className="size-12" />

            <span className="text-2xl font-bold tracking-wide text-[var(--text-primary)]">
              RITMO
            </span>
          </div>
        </div>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Bem-vindo de volta
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Entre na sua conta para continuar organizando sua rotina.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--text-strong)]"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#23834b]/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[var(--text-strong)]"
              >
                Senha
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#23834b]/15"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />

              {isSubmitting
                ? 'Entrando...'
                : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Ainda não tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

