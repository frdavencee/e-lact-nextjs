import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lokasi = await prisma.lokasi.findUnique({
    where: { id: Number(id) },
    include: {
      branch: true,
      project: { include: { waspangRelation: true, branch: true } },
      commissioningTest: { include: { personel: true, images: true } },
      boqItems: true,
      markingKabel: true,
      fotoLampiran: { orderBy: { urutan: 'asc' } },
      opmRecords: true,
      otdrFiles: true,
      generateLogs: { orderBy: { created_at: 'desc' } },
    },
  })

  if (!lokasi) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(lokasi)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const lokasi = await prisma.lokasi.update({
    where: { id: Number(id) },
    data: {
      code: body.code,
      name: body.name,
      branch_id: body.branch_id ? Number(body.branch_id) : null,
    },
  })
  return NextResponse.json(lokasi)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.lokasi.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
