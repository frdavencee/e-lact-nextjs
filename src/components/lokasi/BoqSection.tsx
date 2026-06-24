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
  volume_drm: string
  volume_aktual: string
  volume_tambah: string
  volume_kurang: string
  keterangan: string
}

const emptyRow = (): BoqRow => ({
  kode_item: '', nama_item: '', satuan: '',
  volume_drm: '', volume_aktual: '', volume_tambah: '', volume_kurang: '',
  keterangan: '',
})

export default function BoqSection({ lokasi, onSaved }: Props) {
  const [items, setItems] = useState<BoqRow[]>(
    lokasi.boqItems?.length > 0
      ? lokasi.boqItems.map((b: any) => ({
          kode_item: b.kode_item ?? '',
          nama_item: b.nama_item ?? '',
          satuan: b.satuan ?? '',
          volume_drm: b.volume_drm ?? '',
          volume_aktual: b.volume_aktual ?? '',
          volume_tambah: b.volume_tambah ?? '',
          volume_kurang: b.volume_kurang ?? '',
          keterangan: b.keterangan ?? '',
        }))
      : [emptyRow()]
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const addRow = () => setItems([...items, emptyRow()])
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
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan={2} className="px-2 py-2 text-center font-medium text-gray-600 border border-gray-200 w-8">No</th>
                <th rowSpan={2} className="px-2 py-2 text-left font-medium text-gray-600 border border-gray-200 w-24">Kode Item</th>
                <th rowSpan={2} className="px-2 py-2 text-left font-medium text-gray-600 border border-gray-200 w-40">Nama Item</th>
                <th rowSpan={2} className="px-2 py-2 text-left font-medium text-gray-600 border border-gray-200 w-16">Satuan</th>
                <th colSpan={4} className="px-2 py-2 text-center font-medium text-gray-600 border border-gray-200">Volume</th>
                <th rowSpan={2} className="px-2 py-2 text-left font-medium text-gray-600 border border-gray-200 w-28">Keterangan</th>
                <th rowSpan={2} className="px-2 py-2 border border-gray-200 w-8"></th>
              </tr>
              <tr>
                {['DRM', 'Aktual', 'Tambah', 'Kurang'].map(h => (
                  <th key={h} className="px-2 py-1 text-center font-medium text-gray-600 border border-gray-200 w-20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((row, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 text-center border-r border-gray-200 text-gray-500">{i + 1}</td>
                  {(['kode_item', 'nama_item', 'satuan'] as (keyof BoqRow)[]).map(f => (
                    <td key={f} className="px-1 py-1 border-r border-gray-200">
                      <input type="text" value={row[f]} onChange={e => updateRow(i, f, e.target.value)}
                        className="w-full border-0 bg-transparent px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 rounded" />
                    </td>
                  ))}
                  {(['volume_drm', 'volume_aktual', 'volume_tambah', 'volume_kurang'] as (keyof BoqRow)[]).map(f => (
                    <td key={f} className="px-1 py-1 border-r border-gray-200">
                      <input type="number" value={row[f]} onChange={e => updateRow(i, f, e.target.value)}
                        className="w-full border-0 bg-transparent px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 rounded text-center" />
                    </td>
                  ))}
                  <td className="px-1 py-1 border-r border-gray-200">
                    <input type="text" value={row.keterangan} onChange={e => updateRow(i, 'keterangan', e.target.value)}
                      className="w-full border-0 bg-transparent px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 rounded" />
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={13} />
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
