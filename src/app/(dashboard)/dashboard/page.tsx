'use client'

import { useEffect, useState } from 'react'
import { MapPin, Users, GitBranch, FileText } from 'lucide-react'

interface Stats {
  lokasi: number
  personel: number
  branch: number
  generated: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats)
  }, [])

  const cards = [
    { label: 'Total Lokasi', value: stats?.lokasi, icon: MapPin, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Personel', value: stats?.personel, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Total Branch', value: stats?.branch, icon: GitBranch, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Generate', value: stats?.generated, icon: FileText, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {value === undefined ? '...' : value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
