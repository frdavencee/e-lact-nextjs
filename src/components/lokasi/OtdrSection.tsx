'use client'

import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'

interface Props {
  lokasi: any
  onSaved: () => void
}

export default function OtdrSection({ lokasi, onSaved }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [odpName, setOdpName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const otdrFiles = lokasi.otdrFiles ?? []

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !odpName) { setMsg('File dan nama ODP wajib diisi.'); return }
    setUploading(true)
    setMsg('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('odp_name', odpName)
    const res = await fetch(`/api/lokasi/${lokasi.id}/otdr`, { method: 'POST', body: formData })
    setUploading(false)
    if (res.ok) {
      setMsg('Upload berhasil!')
      setFile(null)
      setOdpName('')
      onSaved()
    } else setMsg('Gagal upload.')
  }

  const handleDelete = async (fileId: number) => {
    if (!confirm('Hapus file OTDR ini?')) return
    const res = await fetch(`/api/lokasi/${lokasi.id}/otdr?fileId=${fileId}`, { method: 'DELETE' })
    if (res.ok) onSaved()
  }

  const grouped = otdrFiles.reduce((acc: Record<string, any[]>, f: any) => {
    const k = f.odp_name ?? 'Lainnya'
    if (!acc[k]) acc[k] = []
    acc[k].push(f)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-3 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700">Upload File OTDR</h4>
        {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nama ODP</label>
            <input type="text" value={odpName} onChange={e => setOdpName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">File Gambar OTDR</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100" required />
          </div>
        </div>
        <button type="submit" disabled={uploading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
          <Upload size={14} /> {uploading ? 'Mengupload...' : 'Upload OTDR'}
        </button>
      </form>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-gray-400">Belum ada file OTDR yang diupload.</p>
      ) : (
        Object.entries(grouped).map(([odp, files]) => (
          <div key={odp}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{odp}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(files as any[]).map((f: any) => (
                <div key={f.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={`/${f.file_path}`} alt={f.odp_name} className="w-full h-40 object-contain p-2" />
                  <button onClick={() => handleDelete(f.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
