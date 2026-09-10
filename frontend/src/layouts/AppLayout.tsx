import { Outlet } from 'react-router'
import { Sidebar } from '../components/navigation/Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7faf7]">
      <Sidebar />

      <main className="min-w-0 flex-1 px-10 py-9">
        <Outlet />
      </main>
    </div>
  )
}