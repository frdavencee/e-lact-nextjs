import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.fotoLampiran.findMany({
    where: { lokasi_id: Number(id) },
    orderBy: { urutan: 'asc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const label = formData.get('label') as string
  const kategori = formData.get('kategori') as string
  const urutan = formData.get('urutan') as string

  if (!file) return NextResponse.json({ error: 'File wajib diupload.' }, { status: 422 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), 'public', 'uploads', 'foto', id)
  await mkdir(uploadDir, { recursive: true })

  const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
  await writeFile(join(uploadDir, filename), buffer)

  const filePath = `uploads/foto/${id}/${filename}`

  const foto = await prisma.fotoLampiran.create({
    data: {
      lokasi_id: Number(id),
      file_path: filePath,
      label: label || null,
      kategori: kategori || null,
      urutan: urutan ? Number(urutan) : 0,
    },
  })
  return NextResponse.json(foto, { status: 201 })
}
