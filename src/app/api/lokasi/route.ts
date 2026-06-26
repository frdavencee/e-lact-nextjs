import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiServerError } from '@/lib/api-error'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const lokasi = await prisma.lokasi.findMany({
      include: { branch: true, project: true },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(lokasi)
  } catch (e) {
    return apiServerError(e)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { code, name, branch_id } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Kode dan nama wajib diisi.' }, { status: 422 })
    }

    const lokasi = await prisma.lokasi.create({
      data: {
        code,
        name,
        branch_id: branch_id ? Number(branch_id) : null,
        user_id: session.user?.id ? Number(session.user.id) : null,
      },
    })
    return NextResponse.json(lokasi, { status: 201 })
  } catch (e) {
    return apiServerError(e)
  }
}
