import clsx from 'clsx'

export default function Input({ label, className, error, ...props }) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm text-slate-700">{label}</div>}
      <input
        className={clsx(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2',
          error && 'border-rose-400 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
    </label>
  )
}