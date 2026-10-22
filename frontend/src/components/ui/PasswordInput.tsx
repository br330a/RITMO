import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function PasswordInput({
  className = '',
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] ${className}`}
      />

      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-2 my-auto flex size-9 cursor-pointer items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]"
      >
        {isVisible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
      </button>
    </div>
  )
}
