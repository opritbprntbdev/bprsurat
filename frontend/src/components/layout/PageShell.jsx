import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar.jsx'
import BottomNav from './BottomNav.jsx'

export default function PageShell() {
  const { pathname } = useLocation()
  const title = pathname.startsWith('/letters') ? 'Surat' : 'BPR Surat'
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={title} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-4 pb-20 sm:pb-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}