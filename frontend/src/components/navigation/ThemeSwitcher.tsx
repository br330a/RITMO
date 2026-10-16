import {
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

type ThemeSwitcherProps = {
  isCollapsed: boolean
}

export function ThemeSwitcher({
  isCollapsed,
}: ThemeSwitcherProps) {
  const {
    theme,
    setTheme,
  } = useTheme()

  const isDark = theme === 'dark'

  function toggleTheme() {
    setTheme(
      isDark ? 'light' : 'dark',
    )
  }

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={
          isDark
            ? 'Mudar para modo claro'
            : 'Mudar para modo escuro'
        }
        aria-label={
          isDark
            ? 'Mudar para modo claro'
            : 'Mudar para modo escuro'
        }
        className="mx-auto hidden size-10 cursor-pointer place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] lg:grid"
      >
        {isDark ? (
          <Moon size={19} />
        ) : (
          <Sun size={19} />
        )}
      </button>
    )
  }

  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Aparência
      </p>

      <div className="flex items-center justify-between rounded-2xl bg-[var(--surface-soft)] px-3 py-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[var(--surface)] text-[var(--text-secondary)]">
          {isDark ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={
            isDark
              ? 'Desativar modo escuro'
              : 'Ativar modo escuro'
          }
          className={[
            'relative h-7 w-11 cursor-pointer rounded-full p-0.5 transition-colors',
            isDark
              ? 'bg-[var(--primary)]'
              : 'bg-[var(--border)]',
          ].join(' ')}
        >
          <span
            className={[
              'block size-6 rounded-full bg-white shadow-sm transition-transform',
              isDark
                ? 'translate-x-4'
                : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>
    </div>
  )
}