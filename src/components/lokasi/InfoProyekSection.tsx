'use client'

import { useState } from 'react'

interface Props {
  lokasi: any
  onSaved: () => void
}

export default function InfoProyekSection({ lokasi, onSaved }: Props) {
  const project = lokasi.project
  const [form, setForm] = useState({
    name: project?.name ?? '',
    contract_number: project?.contract_number ?? '',
    purchase_order_number: project?.purchase_order_number ?? '',
    implementer: project?.implementer ?? '',
    waspang_id: project?.waspang_id ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/lokasi/${lokasi.id}/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) { setMsg('Tersimpan!'); onSaved() }
    else setMsg('Gagal menyimpan.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Nama Proyek</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Kontrak</label>
          <input type="text" value={form.contract_number} onChange={e => setForm({...form, contract_number: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Surat Pesanan</label>
          <input type="text" value={form.purchase_order_number} onChange={e => setForm({...form, purchase_order_number: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Pelaksana</label>
          <input type="text" value={form.implementer} onChange={e => setForm({...form, implementer: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>
      <button type="submit" disabled={saving}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
        {saving ? 'Menyimpan...' : 'Simpan Info Proyek'}
      </button>
    </form>
  )
}
