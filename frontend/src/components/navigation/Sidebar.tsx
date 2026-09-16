import {
  CalendarDays,
  PanelLeft,
  LayoutDashboard,
  ListTodo,
  Shapes,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { RitmoLogo } from '../branding/RitmoLogo'

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
]

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const collapseLabel = isCollapsed
    ? 'Expandir barra lateral'
    : 'Recolher barra lateral'

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-y-auto border-r border-[#e4ebe5] bg-white px-5 py-7 transition-[width,transform,padding] duration-300 motion-reduce:transition-none',
        'lg:translate-x-0',
        isCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div
        className={[
          'mb-10 flex items-center justify-between gap-2 px-3',
          isCollapsed ? 'lg:flex-col lg:gap-4 lg:px-0' : 'lg:px-0',
        ].join(' ')}
      >
        <div className="flex min-w-0 items-center gap-3">
          <RitmoLogo className="size-10" />

          <span
            className={[
              'text-xl font-bold tracking-wide text-[#17211b]',
              isCollapsed ? 'lg:hidden' : '',
            ].join(' ')}
          >
            RITMO
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapseLabel}
          title={collapseLabel}
          aria-expanded={!isCollapsed}
          className="hidden size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[#667069] hover:bg-[#f3f7f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23834b] lg:grid"
        >
          <PanelLeft size={20} />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[#667069] hover:bg-[#f3f7f3] lg:hidden"
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
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23834b]',
                  isCollapsed ? 'lg:justify-center lg:px-0' : '',
                  isActive
                    ? 'bg-[#e4f3e8] text-[#19683a]'
                    : 'text-[#667069] hover:bg-[#f3f7f3] hover:text-[#17211b]',
                ].join(' ')
              }
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className={isCollapsed ? 'lg:hidden' : ''}>
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-[#e4ebe5] pt-5">
        <div className={isCollapsed ? 'lg:hidden' : ''}>
          <p className="px-3 text-sm font-semibold text-[#17211b]">
            Bruno
          </p>

          <p className="px-3 text-xs text-[#7b847e]">
            Minha conta
          </p>
        </div>

        {isCollapsed && (
          <div
            title="Bruno — Minha conta"
            aria-label="Bruno — Minha conta"
            className="mx-auto hidden size-10 place-items-center rounded-full bg-[#e4f3e8] text-sm font-semibold text-[#19683a] lg:grid"
          >
            B
          </div>
        )}
      </div>
    </aside>
  )
}