import { useQuery } from '@tanstack/react-query'
import LogsAPI from '../../services/logs'
import { useState } from 'react'

export default function LogsPage() {
  const [lines, setLines] = useState(200)
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin-logs', { lines }],
    queryFn: () => LogsAPI.tail(lines)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="font-semibold text-slate-800">Laravel Logs</div>
        <select
          value={lines}
          onChange={(e)=>setLines(Number(e.target.value))}
          className="rounded border border-slate-300 text-sm px-2 py-1"
        >
          <option value={100}>100 baris</option>
          <option value={200}>200 baris</option>
          <option value={500}>500 baris</option>
        </select>
        <button
          onClick={()=>refetch()}
          className="rounded-md px-3 py-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          disabled={isFetching}
        >
          {isFetching ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {isLoading && <div className="text-slate-500">Memuat log...</div>}
      {isError && <div className="text-rose-600">Gagal memuat log.</div>}

      <pre className="bg-slate-950 text-slate-100 p-3 rounded-md overflow-auto max-h-[70vh] text-xs">
        {(data?.lines || []).join('\n')}
      </pre>
    </div>
  )
}