import clsx from 'clsx'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    draft: 'bg-slate-100 text-slate-700',
    waiting: 'bg-amber-100 text-amber-700',
    sent: 'bg-sky-100 text-sky-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}