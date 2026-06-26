import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const getLogoDir = () => join(process.env.LARAVEL_PATH ?? 'c:/xampp/htdocs/e-lact-telkom', 'public', 'images')

const findLogo = () => {
  const dir = getLogoDir()
  for (const ext of ['png', 'jpg', 'jpeg', 'svg']) {
    const p = join(dir, `logo.${ext}`)
    if (existsSync(p)) return p
  }
  return null
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ exists: !!findLogo() })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('logo') as File
  if (!file) return NextResponse.json({ error: 'File wajib diupload.' }, { status: 422 })

  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
  if (!allowed.includes(file.type))
    return NextResponse.json({ error: 'Format harus PNG, JPG, atau SVG.' }, { status: 422 })

  const ext = file.type === 'image/svg+xml' ? 'svg' : file.type === 'image/png' ? 'png' : 'jpg'
  const dir = getLogoDir()
  await mkdir(dir, { recursive: true })

  // hapus logo lama jika berbeda ekstensi
  for (const e of ['png', 'jpg', 'jpeg', 'svg']) {
    const old = join(dir, `logo.${e}`)
    if (existsSync(old) && e !== ext) {
      const { unlink } = await import('fs/promises')
      await unlink(old).catch(() => {})
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(dir, `logo.${ext}`), buffer)

  return NextResponse.json({ success: true })
}
