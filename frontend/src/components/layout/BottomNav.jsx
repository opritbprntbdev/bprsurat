import { FileText, Home, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const Item = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={clsx(
        'flex flex-col items-center justify-center text-xs',
        active ? 'text-primary-600' : 'text-slate-500'
      )}
    >
      <Icon className="size-5 mb-1" />
      {label}
    </Link>
  )
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-200 sm:hidden">
      <div className="mx-auto max-w-6xl h-14 grid grid-cols-3 px-6">
        <Item to="/" icon={Home} label="Home" />
        <Item to="/letters" icon={FileText} label="Surat" />
        <Item to="/letters/new" icon={PlusCircle} label="Buat" />
      </div>
    </nav>
  )
}