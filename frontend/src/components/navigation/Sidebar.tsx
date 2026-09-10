import {
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Shapes,
} from 'lucide-react'
import { NavLink } from 'react-router'

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

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#e4ebe5] bg-white px-5 py-7">
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[#23834b] text-white">
          <CheckCircle2 size={23} />
        </div>

        <span className="text-xl font-bold tracking-wide text-[#17211b]">
          RITMO
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#e4f3e8] text-[#19683a]'
                    : 'text-[#667069] hover:bg-[#f3f7f3] hover:text-[#17211b]',
                ].join(' ')
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-[#e4ebe5] pt-5">
        <p className="px-3 text-sm font-semibold text-[#17211b]">Bruno</p>
        <p className="px-3 text-xs text-[#7b847e]">Minha conta</p>
      </div>
    </aside>
  )
}