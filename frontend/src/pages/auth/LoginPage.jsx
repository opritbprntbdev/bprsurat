import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@bpr.local')
  const [password, setPassword] = useState('Password123!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/letters', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Login gagal, cek email/password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="size-12 rounded bg-primary-600 text-white grid place-items-center text-xl font-bold">B</div>
          <h1 className="mt-3 text-xl font-semibold text-slate-800">Masuk ke BPR Surat</h1>
          <p className="text-sm text-slate-500">Gunakan akun yang telah terdaftar</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="space-y-3">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@bpr.local" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
          </div>

          {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}

          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 mt-3">
          v0.1 • API: {import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}
        </div>
      </div>
    </div>
  )
}