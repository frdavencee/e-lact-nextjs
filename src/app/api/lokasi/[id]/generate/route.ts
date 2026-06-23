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
      project: { include: { waspangRelation: true, branch: true } },
      commissioningTest: { include: { personel: true, images: true } },
      boqItems: true,
      markingKabel: true,
      fotoLampiran: { orderBy: { urutan: 'asc' } },
      opmRecords: true,
      otdrFiles: true,
      generateLogs: true,
    },
  })

  if (!lokasi) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Return data for now — DOCX generation via docx library TBD
  return NextResponse.json({
    message: 'Generate endpoint ready',
    lokasi: { id: lokasi.id, code: lokasi.code, name: lokasi.name },
  })
}
