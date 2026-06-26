import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiServerError } from '@/lib/api-error'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = await prisma.markingKabel.findMany({
      where: { lokasi_id: Number(id) },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiServerError(e)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    await prisma.markingKabel.deleteMany({ where: { lokasi_id: Number(id) } })
    await prisma.markingKabel.createMany({
      data: body.items.map((item: any) => ({
        lokasi_id: Number(id),
        jenis_kabel: item.jenis_kabel,
        panjang_meter: item.panjang_meter ? Number(item.panjang_meter) : null,
      })),
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return apiServerError(e)
  }
}
