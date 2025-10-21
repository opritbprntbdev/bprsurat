import clsx from 'clsx'

export default function Button({ variant = 'primary', className, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition'
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-rose-600 text-white hover:bg-rose-700'
  }
  return <button className={clsx(base, variants[variant], className)} {...props} />
}