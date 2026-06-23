'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  lokasi: any
  onSaved: () => void
}

interface OpmRow {
  odp_name: string
  port_1: string
  port_2: string
  port_3: string
  port_4: string
  port_5: string
  port_6: string
  port_7: string
  port_8: string
  notes: string
}

const emptyRow = (): OpmRow => ({
  odp_name: '', port_1: '', port_2: '', port_3: '', port_4: '',
  port_5: '', port_6: '', port_7: '', port_8: '', notes: '',
})

export default function OpmSection({ lokasi, onSaved }: Props) {
  const [items, setItems] = useState<OpmRow[]>(
    lokasi.opmRecords?.length > 0
      ? lokasi.opmRecords.map((r: any) => ({
          odp_name: r.odp_name ?? '',
          port_1: r.port_1 ?? '', port_2: r.port_2 ?? '',
          port_3: r.port_3 ?? '', port_4: r.port_4 ?? '',
          port_5: r.port_5 ?? '', port_6: r.port_6 ?? '',
          port_7: r.port_7 ?? '', port_8: r.port_8 ?? '',
          notes: r.notes ?? '',
        }))
      : [emptyRow()]
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const addRow = () => setItems([...items, emptyRow()])
  const removeRow = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateRow = (i: number, field: keyof OpmRow, value: string) => {
    const updated = [...items]
    updated[i][field] = value
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/lokasi/${lokasi.id}/opm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    setSaving(false)
    if (res.ok) { setMsg('Tersimpan!'); onSaved() }
    else setMsg('Gagal menyimpan.')
  }

  const ports = ['port_1','port_2','port_3','port_4','port_5','port_6','port_7','port_8'] as (keyof OpmRow)[]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Nama ODP</th>
              {ports.map(p => (
                <th key={p} className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                  {p.replace('port_', 'P')}
                </th>
              ))}
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Catatan</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((row, i) => (
              <tr key={i}>
                <td className="px-1 py-1">
                  <input type="text" value={row.odp_name} onChange={e => updateRow(i, 'odp_name', e.target.value)}
                    className="w-32 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-400" />
                </td>
                {ports.map(p => (
                  <td key={p} className="px-1 py-1">
                    <input type="text" value={row[p]} onChange={e => updateRow(i, p, e.target.value)}
                      className="w-16 border border-gray-200 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-400" />
                  </td>
                ))}
                <td className="px-1 py-1">
                  <input type="text" value={row.notes} onChange={e => updateRow(i, 'notes', e.target.value)}
                    className="w-24 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-red-400" />
                </td>
                <td className="px-1 py-1">
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
          <Plus size={14} /> Tambah ODP
        </button>
        <button type="submit" disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
          {saving ? 'Menyimpan...' : 'Simpan Data OPM'}
        </button>
      </div>
    </form>
  )
}
