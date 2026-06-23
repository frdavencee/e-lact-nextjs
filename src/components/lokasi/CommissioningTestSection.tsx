'use client'

import { useState } from 'react'

interface Props {
  lokasi: any
  onSaved: () => void
}

export default function CommissioningTestSection({ lokasi, onSaved }: Props) {
  const ct = lokasi.commissioningTest
  const [form, setForm] = useState({
    personel_id: ct?.personel_id ?? '',
    tanggal: ct?.tanggal ? new Date(ct.tanggal).toISOString().split('T')[0] : '',
    kota_ttd: ct?.kota_ttd ?? '',
    status_pekerjaan: ct?.status_pekerjaan ?? '',
    status_hasil: ct?.status_hasil ?? '',
    status_kelayakan: ct?.status_kelayakan ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/lokasi/${lokasi.id}/commissioning-test`, {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Commissioning</label>
          <input type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Kota TTD</label>
          <input type="text" value={form.kota_ttd} onChange={e => setForm({...form, kota_ttd: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Status Pekerjaan</label>
          <select value={form.status_pekerjaan} onChange={e => setForm({...form, status_pekerjaan: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
            <option value="">-- Pilih --</option>
            <option value="telah">Telah</option>
            <option value="belum">Belum</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Hasil Pekerjaan</label>
          <select value={form.status_hasil} onChange={e => setForm({...form, status_hasil: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
            <option value="">-- Pilih --</option>
            <option value="dapat">Dapat</option>
            <option value="tidak_dapat">Tidak Dapat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Kelayakan UT</label>
          <select value={form.status_kelayakan} onChange={e => setForm({...form, status_kelayakan: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
            <option value="">-- Pilih --</option>
            <option value="layak">Layak</option>
            <option value="tidak_layak">Tidak Layak</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={saving}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
        {saving ? 'Menyimpan...' : 'Simpan Data CT'}
      </button>
    </form>
  )
}
