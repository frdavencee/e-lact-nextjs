'use client'

import { useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'

interface FotoCategory {
  value: string
  label: string
}

interface Props {
  lokasiId: number
  categories: FotoCategory[]
  fotos: any[]
  onSaved: () => void
}

export default function FotoUploadBox({ lokasiId, categories, fotos, onSaved }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [label, setLabel] = useState('')
  const [kategori, setKategori] = useState(categories.length === 1 ? categories[0].value : '')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { setMsg('File wajib dipilih.'); return }
    setUploading(true)
    setMsg('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('label', label)
    formData.append('kategori', kategori)
    const res = await fetch(`/api/lokasi/${lokasiId}/foto`, { method: 'POST', body: formData })
    setUploading(false)
    if (res.ok) {
      setMsg('Upload berhasil!')
      setFile(null)
      setLabel('')
      if (categories.length > 1) setKategori('')
      onSaved()
      setTimeout(() => setMsg(''), 2000)
    } else {
      setMsg('Gagal upload.')
    }
  }

  const handleDelete = async (fotoId: number) => {
    if (!confirm('Hapus foto ini?')) return
    const res = await fetch(`/api/foto/${fotoId}`, { method: 'DELETE' })
    if (res.ok) onSaved()
  }

  const getCatLabel = (val: string) => categories.find(c => c.value === val)?.label ?? val

  const grouped = fotos.reduce((acc: Record<string, any[]>, f: any) => {
    const k = f.kategori ?? 'lainnya'
    if (!acc[k]) acc[k] = []
    acc[k].push(f)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <form onSubmit={handleUpload} className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <div className={`grid gap-3 ${categories.length > 1 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {categories.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sub Kategori</label>
              <select value={kategori} onChange={e => setKategori(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
                <option value="">-- Pilih --</option>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          )}
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

      {fotos.length === 0 ? (
        <p className="text-sm text-gray-400 flex items-center gap-2"><ImageIcon size={14} /> Belum ada foto.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([kat, items]) => (
            <div key={kat}>
              {categories.length > 1 && (
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{getCatLabel(kat)}</h5>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(items as any[]).map((f: any) => (
                  <div key={f.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={`/${f.file_path}`} alt={f.label ?? ''} className="w-full h-28 object-cover" />
                    {f.label && <p className="text-xs text-gray-500 px-2 py-1 truncate">{f.label}</p>}
                    <button type="button" onClick={() => handleDelete(f.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
