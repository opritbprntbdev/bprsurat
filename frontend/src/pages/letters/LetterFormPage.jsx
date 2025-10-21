import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

export default function LetterFormPage() {
  const navigate = useNavigate()
  const [judul, setJudul] = useState('')
  const [isi, setIsi] = useState('')
  const [tipe, setTipe] = useState('keluar')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/letters', { judul, isi, tipe })
      navigate('/letters', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal menyimpan surat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-4">
        <Input label="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} required />
        <label className="block">
          <div className="mb-1 text-sm text-slate-700">Tipe</div>
          <select
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2"
          >
            <option value="keluar">Keluar</option>
            <option value="masuk">Masuk</option>
          </select>
        </label>
        <label className="block">
          <div className="mb-1 text-sm text-slate-700">Isi</div>
          <textarea
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2"
            placeholder="Tulis isi surat..."
          />
        </label>

        {error && <div className="text-sm text-rose-600">{error}</div>}
      </div>

      {/* Sticky action bar (mobile first) */}
      <div className="fixed bottom-16 sm:bottom-6 left-0 right-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => history.back()}>Batal</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Draft'}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}