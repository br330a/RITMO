import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router'
import { Sidebar } from '../components/navigation/Sidebar'
import { RitmoLogo } from '../components/branding/RitmoLogo'
import { AuthLoadingScreen } from '../components/auth/AuthLoadingScreen'
import { useCategories } from '../hooks/useCategories'
import { useTasks } from '../hooks/useTasks'

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false)

  const [
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  ] = useState(false)

  const { isLoadingCategories } =
    useCategories()

  const { isLoadingTasks } =
    useTasks()

  if (
    isLoadingCategories ||
    isLoadingTasks
  ) {
    return <AuthLoadingScreen />
  }

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)]">
      {isSidebarOpen && (
        <button
          type="button"
          onClick={() =>
            setIsSidebarOpen(false)
          }
          aria-label="Fechar menu lateral"
          className="fixed inset-0 z-40 cursor-default bg-black/35 lg:hidden"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() =>
          setIsSidebarOpen(false)
        }
        onToggleCollapse={() =>
          setIsSidebarCollapsed(
            (current) => !current,
          )
        }
      />

      <div
        className={[
          'flex min-w-0 flex-1 flex-col transition-[padding] duration-300 motion-reduce:transition-none',
          isSidebarCollapsed
            ? 'lg:pl-20'
            : 'lg:pl-64',
        ].join(' ')}
      >
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[40px_1fr_40px] items-center border-b border-[var(--border-soft)] bg-[var(--surface)] px-4 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(true)
            }
            aria-label="Abrir menu"
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-[var(--border)] text-[var(--text-strong)] hover:bg-[var(--surface-hover)]"
          >
            <Menu size={21} />
          </button>

          <div className="flex items-center justify-center gap-2.5">
            <RitmoLogo className="size-9" />

            <span className="font-bold tracking-wide text-[var(--text-primary)]">
              RITMO
            </span>
          </div>

          <div
            aria-hidden="true"
            className="size-10"
          />
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
