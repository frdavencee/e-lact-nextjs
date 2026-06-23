import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [lokasi, personel, branch, generated] = await Promise.all([
    prisma.lokasi.count(),
    prisma.personel.count(),
    prisma.branch.count(),
    prisma.generateLog.count(),
  ])

  return NextResponse.json({ lokasi, personel, branch, generated })
}
