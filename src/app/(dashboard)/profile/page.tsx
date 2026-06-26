'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'success' | 'error'>('success')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    const body: any = { name }
    if (newPassword) {
      body.current_password = currentPassword
      body.password = newPassword
    }

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setSaving(false)
    if (res.ok) {
      await update({ name })
      setMsgType('success')
      setMsg('Profil berhasil diperbarui.')
      setCurrentPassword('')
      setNewPassword('')
    } else {
      const err = await res.json()
      setMsgType('error')
      setMsg(err.error ?? 'Gagal menyimpan.')
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Profil Saya</h2>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {msg && (
            <p className={`text-sm px-3 py-2 rounded-lg ${
              msgType === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>{msg}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="text"
              value={session?.user?.email ?? ''}
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <hr className="border-gray-100" />
          <p className="text-xs text-gray-400">Kosongkan jika tidak ingin mengubah password</p>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password Lama</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}
