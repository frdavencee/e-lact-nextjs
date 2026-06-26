import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dir = join(process.env.LARAVEL_PATH ?? 'c:/xampp/htdocs/e-lact-telkom', 'public', 'images')
  let logoPath: string | null = null

  for (const ext of ['png', 'jpg', 'jpeg', 'svg']) {
    const p = join(dir, `logo.${ext}`)
    if (existsSync(p)) { logoPath = p; break }
  }

  if (!logoPath) return NextResponse.json({ error: 'Logo tidak ditemukan.' }, { status: 404 })

  const buffer = await readFile(logoPath)
  const ext = logoPath.split('.').pop()
  const contentType = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/jpeg'

  return new NextResponse(buffer, {
    headers: { 'Content-Type': contentType, 'Cache-Control': 'no-store' },
  })
}
