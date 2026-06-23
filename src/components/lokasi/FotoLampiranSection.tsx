'use client'

import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'

interface Props {
  lokasi: any
  onSaved: () => void
}

const KATEGORI_OPTIONS = [
  { value: 'evident_penarikan_kabel', label: 'Lampiran Evident Pekerjaan' },
  { value: 'marking_kabel', label: 'Lampiran Marking Kabel' },
  { value: 'odp_solid', label: 'Lampiran Evidence ODP' },
  { value: 'pemasangan_odp', label: 'Lampiran Evidence ODP (Pemasangan)' },
  { value: 'aksesoris_hl', label: 'Lampiran Evidence Aksesoris (HL)' },
  { value: 'aksesoris_sc', label: 'Lampiran Evidence Aksesoris (SC)' },
  { value: 'closure_splitter', label: 'Lampiran Evidence Closure & Spliter 1:4' },
  { value: 'opm_hasil_ukur', label: 'Lampiran Evident Hasil Ukur OPM' },
  { value: 'mancore', label: 'Lampiran Mancore' },
  { value: 'as_build_drawing', label: 'Lampiran Evident As Build Drawing (ABD)' },
]

export default function FotoLampiranSection({ lokasi, onSaved }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [label, setLabel] = useState('')
  const [kategori, setKategori] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const fotos = lokasi.fotoLampiran ?? []

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !kategori) { setMsg('File dan kategori wajib diisi.'); return }
    setUploading(true)
    setMsg('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('label', label)
    formData.append('kategori', kategori)
    const res = await fetch(`/api/lokasi/${lokasi.id}/foto`, { method: 'POST', body: formData })
    setUploading(false)
    if (res.ok) {
      setMsg('Upload berhasil!')
      setFile(null)
      setLabel('')
      setKategori('')
      onSaved()
    } else setMsg('Gagal upload.')
  }

  const handleDelete = async (fotoId: number) => {
    if (!confirm('Hapus foto ini?')) return
    const res = await fetch(`/api/foto/${fotoId}`, { method: 'DELETE' })
    if (res.ok) onSaved()
  }

  const grouped = fotos.reduce((acc: Record<string, any[]>, f: any) => {
    const k = f.kategori ?? 'lainnya'
    if (!acc[k]) acc[k] = []
    acc[k].push(f)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-3 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700">Upload Foto Baru</h4>
        {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
            <select value={kategori} onChange={e => setKategori(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
              <option value="">-- Pilih Kategori --</option>
              {KATEGORI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Label (opsional)</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">File Gambar</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100" required />
          </div>
        </div>
        <button type="submit" disabled={uploading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
          <Upload size={14} /> {uploading ? 'Mengupload...' : 'Upload Foto'}
        </button>
      </form>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-gray-400">Belum ada foto yang diupload.</p>
      ) : (
        Object.entries(grouped).map(([kat, items]) => {
          const katLabel = KATEGORI_OPTIONS.find(o => o.value === kat)?.label ?? kat
          return (
            <div key={kat}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{katLabel}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(items as any[]).map((f: any) => (
                  <div key={f.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={`/${f.file_path}`} alt={f.label ?? ''} className="w-full h-28 object-cover" />
                    {f.label && <p className="text-xs text-gray-500 px-2 py-1 truncate">{f.label}</p>}
                    <button onClick={() => handleDelete(f.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
