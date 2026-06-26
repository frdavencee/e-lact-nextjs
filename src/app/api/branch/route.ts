import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiServerError } from '@/lib/api-error'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(branches)
  } catch (e) {
    return apiServerError(e)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const branch = await prisma.branch.create({ data: { name: body.name, code: body.code } })
    return NextResponse.json(branch, { status: 201 })
  } catch (e) {
    return apiServerError(e)
  }
}
