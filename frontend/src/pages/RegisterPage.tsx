import {
  useState,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { RitmoLogo } from '../components/branding/RitmoLogo'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 8) {
      setError(
        'A senha precisa ter pelo menos 8 caracteres.',
      )
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name,
        email,
        password,
      })

      toast.success('Conta criada com sucesso.')
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível criar sua conta.',
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
              Crie sua conta
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#667069]">
              Comece a organizar suas tarefas e manter sua rotina no ritmo.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#27312b]"
              >
                Nome
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Seu nome"
                className="w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/15"
              />
            </div>

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
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                className="w-full rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-sm text-[#17211b] outline-none transition focus:border-[#23834b] focus:ring-2 focus:ring-[#23834b]/15"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#27312b]"
              >
                Confirmar senha
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
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
              <UserPlus size={18} />

              {isSubmitting
                ? 'Criando conta...'
                : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#667069]">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#23834b] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}