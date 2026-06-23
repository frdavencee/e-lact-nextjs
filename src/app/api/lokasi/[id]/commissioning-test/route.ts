import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const lokasiId = Number(id)

  const existing = await prisma.commissioningTest.findUnique({ where: { lokasi_id: lokasiId } })

  const data = {
    personel_id: body.personel_id ? Number(body.personel_id) : null,
    tanggal: body.tanggal ? new Date(body.tanggal) : null,
    kota_ttd: body.kota_ttd,
    status_pekerjaan: body.status_pekerjaan,
    status_hasil: body.status_hasil,
    status_kelayakan: body.status_kelayakan,
  }

  if (existing) {
    const ct = await prisma.commissioningTest.update({ where: { lokasi_id: lokasiId }, data })
    return NextResponse.json(ct)
  }

  const ct = await prisma.commissioningTest.create({ data: { lokasi_id: lokasiId, ...data } })
  return NextResponse.json(ct, { status: 201 })
}
