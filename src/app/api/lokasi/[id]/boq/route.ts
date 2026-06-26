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
    const items = await prisma.boqItem.findMany({
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
    const body = await req.json()
    const item = await prisma.boqItem.create({
      data: {
        lokasi_id: Number(id),
        kode_item: body.kode_item,
        nama_item: body.nama_item,
        satuan: body.satuan,
        volume_drm: body.volume_drm ? Number(body.volume_drm) : null,
        volume_aktual: body.volume_aktual ? Number(body.volume_aktual) : null,
        volume_tambah: body.volume_tambah ? Number(body.volume_tambah) : null,
        volume_kurang: body.volume_kurang ? Number(body.volume_kurang) : null,
        keterangan: body.keterangan,
      },
    })
    return NextResponse.json(item, { status: 201 })
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
    // body.items = array of boq items (bulk replace)
    await prisma.boqItem.deleteMany({ where: { lokasi_id: Number(id) } })
    const items = await prisma.boqItem.createMany({
      data: body.items.map((item: any) => ({
        lokasi_id: Number(id),
        kode_item: item.kode_item,
        nama_item: item.nama_item,
        satuan: item.satuan,
        volume_drm: item.volume_drm ? Number(item.volume_drm) : null,
        volume_aktual: item.volume_aktual ? Number(item.volume_aktual) : null,
        volume_tambah: item.volume_tambah ? Number(item.volume_tambah) : null,
        volume_kurang: item.volume_kurang ? Number(item.volume_kurang) : null,
        keterangan: item.keterangan,
      })),
    })
    return NextResponse.json(items)
  } catch (e) {
    return apiServerError(e)
  }
}
