import {
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type {
  AccentColor,
} from '../../types/themeTypes'

type ThemeSwitcherProps = {
  isCollapsed: boolean
}

const accentOptions: {
  value: AccentColor
  label: string
  className: string
}[] = [
  {
    value: 'green',
    label: 'Verde',
    className: 'bg-[#23834b]',
  },
  {
    value: 'blue',
    label: 'Azul',
    className: 'bg-[#3b82f6]',
  },
  {
    value: 'pink',
    label: 'Rosa',
    className: 'bg-[#db4f83]',
  },
  {
    value: 'amber',
    label: 'Dourado',
    className: 'bg-[#c68a16]',
  },
  {
    value: 'purple',
    label: 'Roxo',
    className: 'bg-[#7c5ac7]',
  },
]

export function ThemeSwitcher({
  isCollapsed,
}: ThemeSwitcherProps) {
  const {
    theme,
    accentColor,
    setTheme,
    setAccentColor,
  } = useTheme()

  const isDark =
    theme === 'dark'

  function toggleTheme() {
    setTheme(
      isDark
        ? 'light'
        : 'dark',
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

      <div className="rounded-2xl bg-[var(--surface-soft)] px-3 py-3">
        <div className="flex items-center justify-between">
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

        <div className="my-3 border-t border-[var(--border-soft)]" />

        <div className="flex items-center justify-between gap-2 px-1">
          {accentOptions.map(
            (option) => {
              const isSelected =
                accentColor ===
                option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setAccentColor(
                      option.value,
                    )
                  }
                  aria-label={`Usar cor ${option.label}`}
                  aria-pressed={
                    isSelected
                  }
                  title={option.label}
                  className={[
                    'grid size-8 cursor-pointer place-items-center rounded-full transition-transform hover:scale-110',
                    isSelected
                      ? 'ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--surface-soft)]'
                      : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'size-5 rounded-full',
                      option.className,
                    ].join(' ')}
                  />
                </button>
              )
            },
          )}
        </div>
      </div>
    </div>
  )
}