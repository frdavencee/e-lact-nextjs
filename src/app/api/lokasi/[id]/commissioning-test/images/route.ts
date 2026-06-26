import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ct = await prisma.commissioningTest.findUnique({ where: { lokasi_id: Number(id) } })
  if (!ct) return NextResponse.json({ error: 'Data CT belum ada. Simpan data CT terlebih dahulu.' }, { status: 422 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const label = formData.get('label') as string

  if (!file) return NextResponse.json({ error: 'File wajib dipilih.' }, { status: 422 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), 'public', 'uploads', 'ct-images', id)
  await mkdir(uploadDir, { recursive: true })

  const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
  await writeFile(join(uploadDir, filename), buffer)

  const maxUrutan = await prisma.commissioningTestImage.aggregate({
    where: { commissioning_test_id: ct.id },
    _max: { urutan: true },
  })

  const image = await prisma.commissioningTestImage.create({
    data: {
      commissioning_test_id: ct.id,
      file_path: `uploads/ct-images/${id}/${filename}`,
      label: label || null,
      urutan: (maxUrutan._max.urutan ?? 0) + 1,
    },
  })
  return NextResponse.json(image, { status: 201 })
}
