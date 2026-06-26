import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { apiServerError } from '@/lib/api-error'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = await prisma.otdrFile.findMany({
      where: { lokasi_id: Number(id) },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiServerError(e)
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const odp_name = formData.get('odp_name') as string

    if (!file) return NextResponse.json({ error: 'File wajib diupload.' }, { status: 422 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'otdr', id)
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
    await writeFile(join(uploadDir, filename), buffer)

    const otdr = await prisma.otdrFile.create({
      data: {
        lokasi_id: Number(id),
        file_path: `uploads/otdr/${id}/${filename}`,
        odp_name: odp_name || null,
      },
    })
    return NextResponse.json(otdr, { status: 201 })
  } catch (e) {
    return apiServerError(e)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const fileId = searchParams.get('fileId')
    if (!fileId) return NextResponse.json({ error: 'fileId required' }, { status: 422 })

    await prisma.otdrFile.delete({ where: { id: Number(fileId) } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return apiServerError(e)
  }
}
