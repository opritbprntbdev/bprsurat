import { useAuth } from '../../hooks/useAuth.jsx'
import { LogOut, Users, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopBar({ title = 'BPR Surat' }) {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-primary-600 text-white grid place-items-center font-bold">B</div>
          <h1 className="font-semibold text-slate-800">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {user?.role_id === 1 && (
            <>
              <Link to="/admin/users" className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700">
                <Users className="size-4" />
                <span className="hidden sm:block">Users</span>
              </Link>
              <Link to="/admin/logs" className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700">
                <FileText className="size-4" />
                <span className="hidden sm:block">Logs</span>
              </Link>
            </>
          )}
          {user && (
            <div className="hidden sm:flex text-sm text-slate-600">
              {user.name} {user.role_id === 1 ? '(Admin)' : ''}
            </div>
          )}
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
            title="Logout"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:block">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  )
}