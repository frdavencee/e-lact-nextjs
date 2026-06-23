'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LayoutDashboard, MapPin, Users, GitBranch, UserCog, User, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lokasi', label: 'Lokasi', icon: MapPin },
  { href: '/personel', label: 'Personel', icon: Users },
  { href: '/branch', label: 'Branch', icon: GitBranch },
  { href: '/users', label: 'Manajemen User', icon: UserCog },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="px-6 py-5 border-b">
        <h1 className="text-lg font-bold text-red-600">E-LACT</h1>
        <p className="text-xs text-gray-500">Telkom Indonesia</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t px-4 py-4 space-y-1">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
            pathname.startsWith('/profile')
              ? 'bg-red-50 text-red-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <User size={18} />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm">{session?.user?.name ?? 'Profil'}</p>
            <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
          </div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
