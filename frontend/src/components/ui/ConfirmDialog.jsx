import React from 'react'

export default function ConfirmDialog({ open, title = 'Konfirmasi', message = '', confirmText = 'Ya', cancelText = 'Batal', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="absolute inset-x-0 top-20 mx-auto max-w-md">
        <div className="mx-4 sm:mx-auto bg-white border border-slate-200 rounded-lg shadow-xl">
          <div className="px-4 py-3 border-b">
            <div className="font-semibold text-slate-800">{title}</div>
          </div>
          <div className="px-4 py-4 text-sm text-slate-700">{message}</div>
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button onClick={onCancel} className="rounded-md px-4 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">{cancelText}</button>
            <button onClick={onConfirm} className="rounded-md px-4 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  )
}