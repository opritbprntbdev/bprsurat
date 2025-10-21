import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]) // { id, title, description, variant }

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(({ title, description = '', variant = 'success', duration = 3000 }) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, title, description, variant, duration }])
    return id
  }, [])

  // Auto-dismiss
  useEffect(() => {
    const timers = toasts.map((t) => {
      return setTimeout(() => remove(t.id), t.duration ?? 3000)
    })
    return () => timers.forEach(clearTimeout)
  }, [toasts, remove])

  const value = useMemo(() => ({ toast, remove }), [toast, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-[calc(100%-2rem)] sm:w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'rounded-md shadow-lg border px-4 py-3 text-sm',
              t.variant === 'success' && 'bg-emerald-50 border-emerald-200 text-emerald-800',
              t.variant === 'error' && 'bg-rose-50 border-rose-200 text-rose-800',
              t.variant === 'info' && 'bg-sky-50 border-sky-200 text-sky-800',
              t.variant === 'warning' && 'bg-amber-50 border-amber-200 text-amber-800',
            )}
          >
            <div className="font-medium">{t.title}</div>
            {t.description ? <div className="mt-0.5 text-[13px] opacity-90">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}