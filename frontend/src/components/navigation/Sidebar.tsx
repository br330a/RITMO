import {
  CalendarDays,
  History,
  LayoutDashboard,
  ListTodo,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Shapes,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { RitmoLogo } from '../branding/RitmoLogo'
import { useAuth } from '../../hooks/useAuth'
import { ThemeSwitcher } from './ThemeSwitcher'

type SidebarProps = {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

const navigationItems = [
  {
    label: 'Início',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Minhas tarefas',
    path: '/tarefas',
    icon: ListTodo,
  },
  {
    label: 'Calendário',
    path: '/calendario',
    icon: CalendarDays,
  },
  {
    label: 'Categorias',
    path: '/categorias',
    icon: Shapes,
  },
  {
    label: 'Histórico',
    path: '/historico',
    icon: History,
  },
]

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const {
    user,
    logout,
  } = useAuth()

  const userInitial =
    user?.name.trim().charAt(0).toUpperCase() || '?'

  function handleLogout() {
    onClose()
    logout()
  }

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-y-auto border-r border-[var(--border-soft)] bg-[var(--surface)] px-5 py-7 transition-[width,transform,padding] duration-300 motion-reduce:transition-none',
        'lg:translate-x-0',
        isCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div
        className={[
          'mb-10 flex items-center justify-between gap-2 px-3',
          isCollapsed ? 'lg:px-0' : 'lg:px-0',
        ].join(' ')}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="group relative size-10 shrink-0">
            <RitmoLogo
              className={[
                'size-10 transition-opacity duration-200',
                isCollapsed
                  ? 'lg:group-hover:opacity-0 lg:group-focus-within:opacity-0'
                  : '',
              ].join(' ')}
            />

            {isCollapsed && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expandir barra lateral"
                title="Expandir barra lateral"
                className="absolute inset-0 hidden size-10 cursor-ew-resize place-items-center rounded-xl text-[var(--primary-strong)] opacity-0 transition-all duration-200 hover:bg-[var(--primary-soft-hover)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] lg:grid lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
              >
                <PanelLeftOpen size={21} />
              </button>
            )}
          </div>

          <span
            className={[
              'text-xl font-bold tracking-wide text-[var(--text-primary)]',
              isCollapsed ? 'lg:hidden' : '',
            ].join(' ')}
          >
            RITMO
          </span>
        </div>

        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Recolher barra lateral"
            title="Recolher barra lateral"
            aria-expanded="true"
            className="hidden size-9 shrink-0 cursor-ew-resize place-items-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] lg:grid"
          >
            <PanelLeftClose size={20} />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex flex-1 flex-col gap-2"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              aria-label={item.label}
              title={
                isCollapsed
                  ? item.label
                  : undefined
              }
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
                  isCollapsed
                    ? 'lg:justify-center lg:px-0'
                    : '',
                  isActive
                    ? 'bg-[var(--primary-soft)] text-[var(--primary-strong)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                ].join(' ')
              }
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className="shrink-0"
                aria-hidden="true"
              />

              <span
                className={
                  isCollapsed ? 'lg:hidden' : ''
                }
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-[var(--border-soft)] pt-5">

        <div className="mb-5">
          <ThemeSwitcher
            isCollapsed={isCollapsed}
          />
        </div>
        <div
          className={
            isCollapsed ? 'lg:hidden' : ''
          }
        >
          <p className="truncate px-3 text-sm font-semibold text-[var(--text-primary)]">
            {user?.name}
          </p>

          <p className="truncate px-3 text-xs text-[var(--text-muted)]">
            {user?.email}
          </p>
        </div>

        {isCollapsed && (
          <div
            title={`${user?.name ?? 'Usuário'} — ${user?.email ?? ''}`}
            aria-label={user?.name ?? 'Usuário'}
            className="mx-auto hidden size-10 place-items-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary-strong)] lg:grid"
          >
            {userInitial}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title="Sair"
          className={[
            'mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-red-50 hover:text-red-700',
            isCollapsed
              ? 'lg:justify-center lg:px-0'
              : '',
          ].join(' ')}
        >
          <LogOut
            size={19}
            className="shrink-0"
          />

          <span
            className={
              isCollapsed ? 'lg:hidden' : ''
            }
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}

