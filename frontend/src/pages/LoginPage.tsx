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
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center">
          <div className="flex items-center gap-3">
            <RitmoLogo className="size-12" />

            <span className="text-2xl font-bold tracking-wide text-[#17211b]">
              RITMO
            </span>
          </div>
        </div>

        <section className="rounded-3xl border border-[#e1e9e2] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#17211b]">
              Bem-vindo de volta
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#667069]">
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
                className="mb-2 block text-sm font-medium text-[#27312b]"
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
                className="w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#27312b]"
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
                className="w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/15"
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
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#23834b] px-4 py-3 font-semibold text-white transition hover:bg-[#1d7040] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />

              {isSubmitting
                ? 'Entrando...'
                : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#667069]">
            Ainda não tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="font-semibold text-[#23834b] hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}