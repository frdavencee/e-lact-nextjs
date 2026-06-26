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
    const items = await prisma.opmRecord.findMany({
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
    await prisma.opmRecord.deleteMany({ where: { lokasi_id: Number(id) } })
    await prisma.opmRecord.createMany({
      data: body.items.map((item: any) => ({
        lokasi_id: Number(id),
        odp_name: item.odp_name,
        port_1: item.port_1,
        port_2: item.port_2,
        port_3: item.port_3,
        port_4: item.port_4,
        port_5: item.port_5,
        port_6: item.port_6,
        port_7: item.port_7,
        port_8: item.port_8,
        notes: item.notes,
      })),
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    return apiServerError(e)
  }
}
