import React from 'react'
import clsx from 'clsx'

export default function AlertModal({ open, onClose, title = '', message = '', variant = 'success' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 top-20 mx-auto max-w-md">
        <div className={clsx(
          'mx-4 sm:mx-auto rounded-lg border shadow-xl overflow-hidden',
          variant === 'success' && 'bg-emerald-50 border-emerald-200',
          variant === 'error' && 'bg-rose-50 border-rose-200',
          variant === 'info' && 'bg-sky-50 border-sky-200',
          variant === 'warning' && 'bg-amber-50 border-amber-200',
        )}>
          <div className="px-4 py-3 border-b bg-white/70">
            <div className="font-semibold text-slate-800">{title}</div>
          </div>
          <div className="px-4 py-4 text-sm text-slate-700">
            {message}
          </div>
          <div className="px-4 py-3 bg-white/70 border-t flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm bg-slate-800 text-white hover:bg-slate-900"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}