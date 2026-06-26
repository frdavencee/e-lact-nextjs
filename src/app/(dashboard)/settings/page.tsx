'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'

export default function SettingsPage() {
  const [hasLogo, setHasLogo] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'success' | 'error'>('success')
  const [timestamp, setTimestamp] = useState(Date.now())
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { checkLogo() }, [])

  const checkLogo = async () => {
    const res = await fetch('/api/settings/logo')
    if (res.ok) {
      const data = await res.json()
      setHasLogo(data.exists)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { setMsgType('error'); setMsg('Pilih file logo terlebih dahulu.'); return }

    setUploading(true)
    setMsg('')

    const formData = new FormData()
    formData.append('logo', file)

    const res = await fetch('/api/settings/logo', { method: 'POST', body: formData })
    setUploading(false)

    if (res.ok) {
      setMsgType('success')
      setMsg('Logo berhasil diupload!')
      setHasLogo(true)
      setTimestamp(Date.now())
      if (fileRef.current) fileRef.current.value = ''
      setPreview(null)
    } else {
      const err = await res.json()
      setMsgType('error')
      setMsg(err.error ?? 'Gagal upload logo.')
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan</h2>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Logo Perusahaan</h3>
          <p className="text-xs text-gray-400 mb-4">
            Logo ditampilkan di cover dokumen PDF. Format: PNG, JPG, SVG. Disarankan ukuran 300×150px.
          </p>

          {hasLogo && !preview && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 inline-block">
              <img
                src={`/api/settings/logo/preview?t=${timestamp}`}
                alt="Logo"
                className="max-h-24 max-w-xs object-contain"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">Logo saat ini</p>
            </div>
          )}

          {preview && (
            <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50 inline-block">
              <img src={preview} alt="Preview" className="max-h-24 max-w-xs object-contain" />
              <p className="text-xs text-blue-500 mt-2 text-center">Preview</p>
            </div>
          )}

          {!hasLogo && !preview && (
            <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center text-sm text-gray-400">
              Belum ada logo
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-3">
            {msg && (
              <p className={`text-sm px-3 py-2 rounded-lg ${
                msgType === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>{msg}</p>
            )}
            <input
              type="file"
              ref={fileRef}
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
            />
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? 'Mengupload...' : hasLogo ? 'Ganti Logo' : 'Upload Logo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
