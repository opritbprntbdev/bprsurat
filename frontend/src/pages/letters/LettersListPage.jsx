import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import Badge from '../../components/ui/Badge.jsx'
import { Plus } from 'lucide-react'

function statusToVariant(status) {
  switch ((status || '').toLowerCase()) {
    case 'draft': return 'draft'
    case 'menunggu':
    case 'pending': return 'waiting'
    case 'disposisi':
    case 'sent': return 'sent'
    case 'disetujui':
    case 'approved': return 'approved'
    case 'ditolak':
    case 'rejected': return 'rejected'
    default: return 'default'
  }
}

export default function LettersListPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['letters', { page: 1 }],
    queryFn: async () => {
      const { data } = await api.get('/letters')
      return data
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          placeholder="Cari judul surat..."
          className="w-full sm:max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2"
          onKeyDown={(e) => { if (e.key === 'Enter') refetch() }}
        />
        <Link to="/letters/new" className="hidden sm:inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">
          <Plus className="size-4" /> Buat Surat
        </Link>
      </div>

      {isLoading && <div className="text-slate-500">Memuat daftar surat...</div>}
      {isError && <div className="text-rose-600">Gagal memuat. <button className="underline" onClick={() => refetch()}>Coba lagi</button></div>}

      {!isLoading && data?.data?.length === 0 && (
        <div className="grid place-items-center py-16 bg-white border border-dashed border-slate-300 rounded-lg">
          <div className="text-center">
            <div className="text-slate-800 font-medium">Belum ada surat</div>
            <div className="text-slate-500 text-sm">Klik tombol di bawah untuk membuat surat pertama</div>
            <Link to="/letters/new" className="mt-3 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">
              <Plus className="size-4" /> Buat Surat
            </Link>
          </div>
        </div>
      )}

      {/* Card list (mobile) */}
      <div className="sm:hidden space-y-3">
        {data?.data?.map((it) => (
          <Link key={it.id} to={`/letters/${it.id || ''}`} className="block">
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-800 line-clamp-1">{it.judul || '(Tanpa judul)'}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{it.tipe || '-'} • {new Date(it.updated_at).toLocaleString()}</div>
                </div>
                <Badge variant={statusToVariant(it.status)}>{it.status || '-'}</Badge>
              </div>
              <div className="text-sm text-slate-600 mt-2 line-clamp-2">{it.isi}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Table (desktop) */}
      <div className="hidden sm:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Judul</th>
              <th className="text-left px-4 py-2">Tipe</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Terakhir Update</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((it) => (
              <tr key={it.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{it.id}</td>
                <td className="px-4 py-2">{it.judul}</td>
                <td className="px-4 py-2">{it.tipe}</td>
                <td className="px-4 py-2">
                  <Badge variant={statusToVariant(it.status)}>{it.status}</Badge>
                </td>
                <td className="px-4 py-2">{new Date(it.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAB mobile */}
      <Link to="/letters/new" className="sm:hidden fixed right-4 bottom-20 rounded-full bg-primary-600 text-white p-4 shadow-xl">
        <Plus className="size-6" />
      </Link>
    </div>
  )
}