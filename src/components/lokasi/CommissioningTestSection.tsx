'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'

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
  const [personelList, setPersonelList] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [label, setLabel] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/personel').then(r => r.json()).then(setPersonelList)
  }, [])

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { setUploadMsg('Pilih file gambar terlebih dahulu.'); return }
    setUploading(true)
    setUploadMsg('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('label', label)
    const res = await fetch(`/api/lokasi/${lokasi.id}/commissioning-test/images`, { method: 'POST', body: formData })
    setUploading(false)
    if (res.ok) {
      setUploadMsg('Upload berhasil!')
      setLabel('')
      if (fileRef.current) fileRef.current.value = ''
      onSaved()
      setTimeout(() => setUploadMsg(''), 2000)
    } else {
      const err = await res.json()
      setUploadMsg(err.error ?? 'Gagal upload.')
    }
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm('Hapus gambar ini?')) return
    const res = await fetch(`/api/lokasi/${lokasi.id}/commissioning-test/images/${imageId}`, { method: 'DELETE' })
    if (res.ok) onSaved()
  }

  const images = ct?.images ?? []

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {msg && <p className={`text-sm ${msg.includes('Gagal') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">WASPANG</label>
            <select value={form.personel_id} onChange={e => setForm({...form, personel_id: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" required>
              <option value="">-- Pilih WASPANG --</option>
              {personelList.map(p => (
                <option key={p.id} value={p.id}>{p.nama} ({p.nik})</option>
              ))}
            </select>
          </div>
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

      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Upload Tanda Tangan</h4>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {images.map((img: any) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={`/${img.file_path}`} alt={img.label ?? ''} className="w-full h-28 object-contain p-1" />
                {img.label && <p className="text-xs text-gray-500 px-2 py-1 truncate">{img.label}</p>}
                <button type="button" onClick={() => handleDelete(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleUpload} className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
          {uploadMsg && <p className={`text-sm ${uploadMsg.includes('Gagal') || uploadMsg.includes('Pilih') ? 'text-red-500' : 'text-green-600'}`}>{uploadMsg}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label (opsional)</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">File Gambar</label>
              <input type="file" ref={fileRef} accept="image/*"
                className="w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100" />
            </div>
          </div>
          <button type="submit" disabled={uploading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
            <Upload size={14} /> {uploading ? 'Mengupload...' : 'Upload Tanda Tangan'}
          </button>
        </form>
      </div>
    </div>
  )
}
