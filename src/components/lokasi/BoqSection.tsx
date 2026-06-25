'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, FileSpreadsheet } from 'lucide-react'
import FotoUploadBox from './FotoUploadBox'
import * as XLSX from 'xlsx'

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
}

const emptyRow = (): BoqRow => ({
  kode_item: '', nama_item: '', satuan: '',
  volume_drm: '', volume_aktual: '', volume_tambah: '', volume_kurang: '',
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
        }))
      : [emptyRow()]
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const excelRef = useRef<HTMLInputElement>(null)

  const saveItems = async (itemsToSave: BoqRow[]) => {
    setSaving(true)
    setMsg('')
    const res = await fetch(`/api/lokasi/${lokasi.id}/boq`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToSave }),
    })
    setSaving(false)
    if (res.ok) { setMsg('Tersimpan!'); onSaved() }
    else setMsg('Gagal menyimpan.')
  }

  const parseExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

      let colNo = -1, colDesignator = -1, colUraian = -1, colSatuan = -1
      let colDrm = -1, colAktual = -1, colTambah = -1, colKurang = -1
      let dataStartRow = 0

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].map((c: any) => String(c).trim().toUpperCase())
        if (colDesignator === -1 && row.includes('DESIGNATOR')) {
          colNo = row.indexOf('NO')
          colDesignator = row.indexOf('DESIGNATOR')
          colUraian = row.findIndex((c: string) => c.includes('URAIAN'))
          colSatuan = row.indexOf('SATUAN')
        }
        if (colDrm === -1 && row.includes('DRM') && row.includes('AKTUAL')) {
          colDrm = row.indexOf('DRM')
          colAktual = row.indexOf('AKTUAL')
          colTambah = row.indexOf('TAMBAH')
          colKurang = row.indexOf('KURANG')
          dataStartRow = i + 1
        }
      }

      if (colDesignator === -1 || colDrm === -1) {
        setMsg('Format Excel tidak dikenali. Pastikan ada kolom DESIGNATOR, DRM, dan AKTUAL.')
        return
      }

      const toNum = (val: any): string => {
        const s = String(val ?? '').trim()
        if (!s || s === '-') return ''
        const n = parseFloat(s)
        return isNaN(n) ? '' : String(n)
      }

      const parsed: BoqRow[] = []
      for (let i = dataStartRow; i < rows.length; i++) {
        const row = rows[i]
        const noVal = String(row[colNo] ?? '').trim()
        if (!noVal || isNaN(Number(noVal))) continue
        parsed.push({
          kode_item: String(row[colDesignator] ?? '').trim(),
          nama_item: String(row[colUraian] ?? '').trim(),
          satuan: String(row[colSatuan] ?? '').trim(),
          volume_drm: toNum(row[colDrm]),
          volume_aktual: toNum(row[colAktual]),
          volume_tambah: toNum(row[colTambah]),
          volume_kurang: toNum(row[colKurang]),
        })
      }

      if (parsed.length > 0) {
        setItems(parsed)
        await saveItems(parsed)
      } else {
        setMsg('Tidak ada data yang bisa diimpor. Periksa format file Excel.')
      }
      if (excelRef.current) excelRef.current.value = ''
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveItems(items)
  }

  const addRow = () => setItems([...items, emptyRow()])
  const removeRow = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateRow = (i: number, field: keyof BoqRow, value: string) => {
    const updated = [...items]
    updated[i][field] = value
    setItems(updated)
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
        <div className="flex gap-3 flex-wrap">
          <input
            ref={excelRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={parseExcel}
          />
          <button type="button" onClick={() => excelRef.current?.click()}
            className="flex items-center gap-1 text-sm text-green-700 border border-green-300 rounded-lg px-3 py-1.5 hover:bg-green-50 transition">
            <FileSpreadsheet size={14} /> Import Excel
          </button>
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
