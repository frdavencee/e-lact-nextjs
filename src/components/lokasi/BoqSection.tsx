'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import FotoUploadBox from './FotoUploadBox'

interface Props {
  lokasi: any
  onSaved: () => void
}

interface BoqRow {
  kode_item: string
  nama_item: string
  satuan: string
  volume: string
  keterangan: string
}

export default function BoqSection({ lokasi, onSaved }: Props) {
  const [items, setItems] = useState<BoqRow[]>(
    lokasi.boqItems?.length > 0
      ? lokasi.boqItems.map((b: any) => ({
          kode_item: b.kode_item ?? '',
          nama_item: b.nama_item ?? '',
          satuan: b.satuan ?? '',
          volume: b.volume ?? '',
          keterangan: b.keterangan ?? '',
        }))
      : [{ kode_item: '', nama_item: '', satuan: '', volume: '', keterangan: '' }]
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const addRow = () => setItems([...items, { kode_item: '', nama_item: '', satuan: '', volume: '', keterangan: '' }])
  const removeRow = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateRow = (i: number, field: keyof BoqRow, value: string) => {
    const updated = [...items]
    updated[i][field] = value
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/lokasi/${lokasi.id}/boq`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    setSaving(false)
    if (res.ok) { setMsg('Tersimpan!'); onSaved() }
    else setMsg('Gagal menyimpan.')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {['Kode Item', 'Nama Item', 'Satuan', 'Volume', 'Keterangan', ''].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((row, i) => (
                <tr key={i}>
                  {(['kode_item', 'nama_item', 'satuan', 'volume', 'keterangan'] as (keyof BoqRow)[]).map(field => (
                    <td key={field} className="px-2 py-1">
                      <input type="text" value={row[field]} onChange={e => updateRow(i, field, e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-400" />
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={addRow}
            className="flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
            <Plus size={14} /> Tambah Baris
          </button>
          <button type="submit" disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan BOQ'}
          </button>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Foto Laporan BOQ</h4>
        <FotoUploadBox
          lokasiId={lokasi.id}
          categories={[{ value: 'laporan_boq', label: 'Laporan BOQ' }]}
          fotos={(lokasi.fotoLampiran ?? []).filter((f: any) => f.kategori === 'laporan_boq')}
          onSaved={onSaved}
        />
      </div>
    </div>
  )
}
