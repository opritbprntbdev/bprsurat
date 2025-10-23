import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import UsersAPI from '../../services/users'
import { useAuth } from '../../hooks/useAuth.jsx'
import { Pencil, X, Trash2 } from 'lucide-react'
import { useToast } from '../../components/ui/ToastProvider.jsx'
import AlertModal from '../../components/ui/AlertModal.jsx'
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx'

const ROLE_OPTIONS = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Sekper' },
  { value: 3, label: 'Direksi' },
  { value: 4, label: 'Divisi' },
  { value: 5, label: 'Cabang' },
]

function getErrMsg(e) {
  return e?.response?.data?.message || e?.message || 'Terjadi kesalahan'
}

export default function UsersPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [perPage] = useState(5)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Alert info/sukses/gagal
  const [alert, setAlert] = useState({ open: false, title: '', message: '', variant: 'success' })
  const showAlert = (variant, title, message) => setAlert({ open: true, title, message, variant })

  // Konfirmasi hapus
  const [confirm, setConfirm] = useState({ open: false, id: null, name: '' })

  // Create form (user cabang cepat)
  const [form, setForm] = useState({ name: '', email: '', branch_id: '' })
  const [creating, setCreating] = useState(false)

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role_id: 5,
    branch_id: '',
    division_id: '',
    director_id: '',
    status: 'aktif',
  })

  // TAMBAH: tangkap `error` dan munculkan toast ketika gagal
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-users', page, perPage, debouncedSearch],
    queryFn: () => UsersAPI.list({ page, per_page: perPage, q: debouncedSearch }),
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal memuat daftar user', description: msg })
    }
  })

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  // when debounced search changes, reset to page 1
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const createMut = useMutation({
    mutationFn: (payload) => UsersAPI.create(payload),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Berhasil', description: 'User cabang dibuat.' })
      if (res?.temporary_password) showAlert('info', 'Sandi Sementara', `Password: ${res.temporary_password}`)
      setForm({ name: '', email: '', branch_id: '' })
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal membuat user', description: msg })
      showAlert('error', 'Gagal', msg)
    },
    onSettled: () => setCreating(false)
  })

  const resetMut = useMutation({
    mutationFn: (id) => UsersAPI.resetPassword(id),
    onSuccess: (res) => {
      toast({ variant: 'success', title: 'Sandi direset' })
      if (res?.temporary_password) showAlert('info', 'Sandi Sementara', `Password: ${res.temporary_password}`)
    },
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal reset sandi', description: msg })
      showAlert('error', 'Gagal', msg)
    }
  })

  const deactivateMut = useMutation({
    mutationFn: (id) => UsersAPI.deactivate(id),
    onSuccess: () => {
      toast({ variant: 'success', title: 'User dinonaktifkan' })
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal menonaktifkan', description: msg })
      showAlert('error', 'Gagal', msg)
    }
  })

  const deleteMut = useMutation({
    mutationFn: (id) => UsersAPI.delete(id),
    onSuccess: () => {
      toast({ variant: 'success', title: 'User dihapus' })
      setConfirm({ open: false, id: null, name: '' })
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal menghapus', description: msg })
      showAlert('error', 'Gagal', msg)
    }
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => UsersAPI.update(id, payload),
    onSuccess: () => {
      toast({ variant: 'success', title: 'Perubahan tersimpan' })
      showAlert('success', 'Sukses', 'User diperbarui.')
      setEditOpen(false)
      setEditUser(null)
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (e) => {
      const msg = getErrMsg(e)
      toast({ variant: 'error', title: 'Gagal menyimpan', description: msg })
      showAlert('error', 'Gagal', msg)
    }
  })

  const onCreate = (e) => {
    e.preventDefault()
    setCreating(true)
    const branchId = form.branch_id ? Number(form.branch_id) : null
    createMut.mutate({ name: form.name, email: form.email, role_id: 5, branch_id: branchId })
  }

  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({
      name: u.name || '',
      email: u.email || '',
      role_id: u.role_id || 5,
      branch_id: u.branch_id ?? '',
      division_id: u.division_id ?? '',
      director_id: u.director_id ?? '',
      status: u.status || 'aktif',
    })
    setEditOpen(true)
  }

  const handleRoleChange = (val) => {
    const role = Number(val)
    setEditForm(s => ({
      ...s,
      role_id: role,
      branch_id: role === 5 ? s.branch_id : '',
      division_id: role === 4 ? s.division_id : '',
      director_id: role === 3 ? s.director_id : '',
    }))
  }

  const onSaveEdit = (e) => {
    e.preventDefault()
    if (!editUser) return
    const role = Number(editForm.role_id)
    const payload = {
      name: editForm.name,
      email: editForm.email,
      role_id: role,
      status: editForm.status,
    }
    if (role === 5) payload.branch_id = editForm.branch_id === '' ? null : Number(editForm.branch_id)
    if (role === 4) payload.division_id = editForm.division_id === '' ? null : Number(editForm.division_id)
    if (role === 3) payload.director_id = editForm.director_id === '' ? null : Number(editForm.director_id)
    updateMut.mutate({ id: editUser.id, payload })
  }

  if (user?.role_id !== 1) {
    return <div className="text-rose-600">Akses admin saja.</div>
  }

  const role = Number(editForm.role_id)

  return (
    <div className="space-y-6">
      {/* Create user cabang */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="font-semibold text-slate-800 mb-3">Buat User Cabang</div>
        <form onSubmit={onCreate} className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Nama</div>
            <input value={form.name} onChange={(e)=>setForm(s=>({ ...s, name: e.target.value }))} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="User Cabang Selong" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Email</div>
            <input value={form.email} onChange={(e)=>setForm(s=>({ ...s, email: e.target.value }))} type="email" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="selong@bpr.local" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-slate-700">Branch ID (untuk Cabang)</div>
            <input value={form.branch_id} onChange={(e)=>setForm(s=>({ ...s, branch_id: e.target.value }))} type="number" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="10" />
          </label>
          <div className="sm:col-span-3 flex items-center justify-end gap-2">
            <button type="button" className="rounded-md px-4 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={()=>setForm({ name:'', email:'', branch_id:'' })}>Bersihkan</button>
            <button type="submit" disabled={creating || createMut.isPending} className="rounded-md px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
              {creating || createMut.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>

      {/* List user */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="font-semibold text-slate-800">Daftar User</div>
          <div className="flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email..." className="rounded-md border border-slate-300 px-3 py-1 text-sm outline-none" />
            <button className="text-sm text-slate-600 underline" onClick={()=>refetch()} disabled={isFetching}>
              {isFetching ? 'Memuat...' : 'Refresh'}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Nama</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Kode Cabang</th>
                <th className="text-left px-4 py-2">Divisi</th>
                <th className="text-left px-4 py-2">Direktorat</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="px-4 py-3 text-slate-500" colSpan={9}>Memuat data...</td></tr>}

              {/* TAMBAH: tampilkan pesan error dari server */}
              {isError && (
                <tr>
                  <td className="px-4 py-3 text-rose-600" colSpan={9}>
                    Gagal memuat data{typeof error?.response?.data?.message === 'string' ? `: ${error.response.data.message}` : ''}.
                  </td>
                </tr>
              )}

              {data?.data?.map((u, idx) => {
                const disableDelete = user?.id === u.id || u.role_id === 1 // jangan hapus diri sendiri atau Admin
                const currentPage = data?.current_page ?? page
                const currentPerPage = data?.per_page ?? perPage
                const serial = (currentPage - 1) * currentPerPage + (idx + 1)
                return (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-4 py-2">{serial}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role_id}</td>
                    <td className="px-4 py-2">{u.branch_id ?? '-'}</td>
                    <td className="px-4 py-2">{u.division_id ?? '-'}</td>
                    <td className="px-4 py-2">{u.director_id ?? '-'}</td>
                    <td className="px-4 py-2">{u.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={()=>openEdit(u)} className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                        <Pencil className="size-3.5" /> Edit
                      </button>
                      <button onClick={()=>resetMut.mutate(u.id)} className="rounded-md px-3 py-1.5 text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">Reset PW</button>
                      <button onClick={()=>deactivateMut.mutate(u.id)} className="rounded-md px-3 py-1.5 text-xs bg-amber-600 text-white hover:bg-amber-700">Nonaktif</button>
                      <button
                        onClick={()=>setConfirm({ open: true, id: u.id, name: u.name })}
                        disabled={disableDelete}
                        className="rounded-md px-3 py-1.5 text-xs bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
                        title={disableDelete ? 'Tidak bisa menghapus akun ini' : 'Hapus user'}
                      >
                        <Trash2 className="inline-block size-3.5 mr-1" /> Hapus
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!isLoading && !isError && data?.data?.length === 0 && <tr><td className="px-4 py-3 text-slate-500" colSpan={9}>Belum ada user</td></tr>}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">Tampilkan {data?.from ?? '-'} sampai {data?.to ?? '-'} dari {data?.total ?? '-'}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={isFetching || (data?.current_page ?? page) <= 1} className="rounded-md px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50">Prev</button>
            <div className="text-sm text-slate-600">Halaman {data?.current_page ?? page} / {data?.last_page ?? 1}</div>
            <button onClick={() => setPage(p => Math.min((data?.last_page ?? 1), p + 1))} disabled={isFetching || (data?.current_page ?? page) >= (data?.last_page ?? 1)} className="rounded-md px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setEditOpen(false)} />
          <div className="absolute inset-x-0 top-12 sm:top-16 mx-auto max-w-2xl">
            <div className="mx-4 sm:mx-auto bg-white border border-slate-200 rounded-lg shadow-xl">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="font-semibold text-slate-800">Edit User {editUser?.id}</div>
                <button className="p-1 rounded hover:bg-slate-100" onClick={()=>setEditOpen(false)}>
                  <X className="size-5 text-slate-600" />
                </button>
              </div>
              <form onSubmit={onSaveEdit} className="p-4 grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-sm text-slate-700">Nama</div>
                  <input value={editForm.name} onChange={(e)=>setEditForm(s=>({ ...s, name: e.target.value }))} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" />
                </label>
                <label className="block">
                  <div className="mb-1 text-sm text-slate-700">Email</div>
                  <input value={editForm.email} onChange={(e)=>setEditForm(s=>({ ...s, email: e.target.value }))} type="email" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" />
                </label>
                <label className="block">
                  <div className="mb-1 text-sm text-slate-700">Role</div>
                  <select value={editForm.role_id} onChange={(e)=>handleRoleChange(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2">
                    {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <div className="mb-1 text-sm text-slate-700">Status</div>
                  <select value={editForm.status} onChange={(e)=>setEditForm(s=>({ ...s, status: e.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2">
                    <option value="aktif">aktif</option>
                    <option value="nonaktif">nonaktif</option>
                  </select>
                </label>
                {role === 5 && (
                  <label className="block">
                    <div className="mb-1 text-sm text-slate-700">Branch ID (Cabang)</div>
                    <input value={editForm.branch_id} onChange={(e)=>setEditForm(s=>({ ...s, branch_id: e.target.value }))} type="number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="contoh: 10" />
                  </label>
                )}
                {role === 4 && (
                  <label className="block">
                    <div className="mb-1 text-sm text-slate-700">Division ID (Divisi)</div>
                    <input value={editForm.division_id} onChange={(e)=>setEditForm(s=>({ ...s, division_id: e.target.value }))} type="number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="contoh: 1" />
                  </label>
                )}
                {role === 3 && (
                  <label className="block">
                    <div className="mb-1 text-sm text-slate-700">Director ID (Direksi)</div>
                    <input value={editForm.director_id} onChange={(e)=>setEditForm(s=>({ ...s, director_id: e.target.value }))} type="number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-primary-600 focus:ring-2" placeholder="contoh: 1" />
                  </label>
                )}
                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button type="button" className="rounded-md px-4 py-2 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={()=>setEditOpen(false)}>Batal</button>
                  <button type="submit" disabled={updateMut.isPending} className="rounded-md px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
                    {updateMut.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
              <div className="px-4 pb-4">
                <div className="text-xs text-slate-500">Catatan: Field tambahan hanya muncul jika role perlu (Cabang/Divisi/Direksi).</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal open={alert.open} onClose={()=>setAlert(s=>({ ...s, open:false }))} title={alert.title} message={alert.message} variant={alert.variant} />

      <ConfirmDialog
        open={confirm.open}
        title="Hapus User?"
        message={`User "${confirm.name}" akan dihapus permanen. Lanjutkan?`}
        confirmText="Hapus"
        cancelText="Batal"
        onCancel={()=>setConfirm({ open:false, id:null, name:'' })}
        onConfirm={()=>deleteMut.mutate(confirm.id)}
      />
    </div>
  )
}