import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.boqItem.findMany({
    where: { lokasi_id: Number(id) },
    orderBy: { id: 'asc' },
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const item = await prisma.boqItem.create({
    data: {
      lokasi_id: Number(id),
      kode_item: body.kode_item,
      nama_item: body.nama_item,
      satuan: body.satuan,
      volume: body.volume ? Number(body.volume) : null,
      keterangan: body.keterangan,
    },
  })
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // body.items = array of boq items (bulk replace)
  await prisma.boqItem.deleteMany({ where: { lokasi_id: Number(id) } })
  const items = await prisma.boqItem.createMany({
    data: body.items.map((item: any) => ({
      lokasi_id: Number(id),
      kode_item: item.kode_item,
      nama_item: item.nama_item,
      satuan: item.satuan,
      volume: item.volume ? Number(item.volume) : null,
      keterangan: item.keterangan,
    })),
  })
  return NextResponse.json(items)
}
