import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToBuffer } from '@react-pdf/renderer'
import { LactDocument } from '@/components/pdf/LactDocument'
import React from 'react'
import { apiServerError } from '@/lib/api-error'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lokasi = await prisma.lokasi.findUnique({
    where: { id: Number(id) },
    include: {
      branch: true,
      project: { include: { waspangRelation: true, branch: true } },
      commissioningTest: { include: { personel: true, images: { orderBy: { urutan: 'asc' } } } },
      boqItems: true,
      markingKabel: true,
      fotoLampiran: { orderBy: { urutan: 'asc' } },
      opmRecords: true,
      otdrFiles: true,
    },
  })

  if (!lokasi) return NextResponse.json({ error: 'Lokasi tidak ditemukan.' }, { status: 404 })

  try {
    const buffer = await renderToBuffer(React.createElement(LactDocument, { lokasi }) as any)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="LACT_${lokasi.code}.pdf"`,
      },
    })
  } catch (e: any) {
    console.error('PDF generation error:', e)
    return NextResponse.json({ error: 'Gagal generate PDF: ' + e.message }, { status: 500 })
  }
}
