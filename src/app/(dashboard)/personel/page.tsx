'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Personel {
  id: number
  nama: string
  nik: string
  jabatan?: string
}

export default function PersonelPage() {
  const [list, setList] = useState<Personel[]>([])
  const [form, setForm] = useState({ nama: '', nik: '', jabatan: '' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const res = await fetch('/api/personel')
    if (res.ok) {
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/personel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setForm({ nama: '', nik: '', jabatan: '' })
    setShowForm(false)
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Data Personel</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <Plus size={16} /> Tambah Personel
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
              <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">NIK</label>
              <input type="text" value={form.nik} onChange={e => setForm({...form, nik: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Jabatan</label>
              <input type="text" value={form.jabatan} onChange={e => setForm({...form, jabatan: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button type="submit" disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {list.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Belum ada data personel.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nama</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">NIK</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Jabatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{p.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{p.nik}</td>
                  <td className="px-4 py-3 text-gray-600">{p.jabatan ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
