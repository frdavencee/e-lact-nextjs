'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, MapPin, Eye, Trash2 } from 'lucide-react'

interface Lokasi {
  id: number
  code: string
  name: string
  status: string
  branch?: { name: string }
  project?: { name: string } | null
}

export default function LokasiPage() {
  const [lokasi, setLokasi] = useState<Lokasi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', branch_id: '' })
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    fetchLokasi()
    fetchBranches()
  }, [])

  const fetchLokasi = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/lokasi')
    if (res.ok) {
      const data = await res.json()
      setLokasi(Array.isArray(data) ? data : [])
    } else {
      const err = await res.json().catch(() => ({}))
      setError(err.error ?? `Error ${res.status}`)
      setLokasi([])
    }
    setLoading(false)
  }

  const fetchBranches = async () => {
    const res = await fetch('/api/branch')
    if (res.ok) {
      const data = await res.json()
      setBranches(Array.isArray(data) ? data : [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/lokasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ code: '', name: '', branch_id: '' })
    setShowForm(false)
    fetchLokasi()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus lokasi ini?')) return
    await fetch(`/api/lokasi/${id}`, { method: 'DELETE' })
    fetchLokasi()
  }

  const badgeColor: Record<string, string> = {
    belum: 'bg-gray-100 text-gray-600',
    draft: 'bg-yellow-100 text-yellow-700',
    siap: 'bg-blue-100 text-blue-700',
    generated: 'bg-green-100 text-green-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Lokasi</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} /> Tambah Lokasi
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Tambah Lokasi Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Kode Lokasi</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nama Lokasi</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Branch</label>
              <select
                value={form.branch_id}
                onChange={e => setForm({ ...form, branch_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Pilih Branch --</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                Simpan
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Memuat data...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">Gagal memuat data: {error}</div>
        ) : lokasi.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Belum ada data lokasi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Kode</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nama</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Branch</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Proyek</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lokasi.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{l.code}</td>
                  <td className="px-4 py-3 text-gray-800">{l.name}</td>
                  <td className="px-4 py-3 text-gray-600">{l.branch?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{l.project?.name ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor[l.status] ?? badgeColor.belum}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/lokasi/${l.id}`} className="text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
