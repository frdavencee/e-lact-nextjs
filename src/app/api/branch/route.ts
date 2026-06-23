import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const branches = await prisma.branch.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(branches)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const branch = await prisma.branch.create({ data: { name: body.name, code: body.code } })
  return NextResponse.json(branch, { status: 201 })
}
