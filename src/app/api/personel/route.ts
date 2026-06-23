import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const personel = await prisma.personel.findMany({ orderBy: { nama: 'asc' } })
  return NextResponse.json(personel)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const personel = await prisma.personel.create({
    data: { nama: body.nama, nik: body.nik, jabatan: body.jabatan, position: body.position },
  })
  return NextResponse.json(personel, { status: 201 })
}
