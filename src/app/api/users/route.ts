import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { apiServerError } from '@/lib/api-error'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, created_at: true },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(users)
  } catch (e) {
    return apiServerError(e)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password)
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi.' }, { status: 422 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: 'Email sudah digunakan.' }, { status: 422 })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, created_at: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e) {
    return apiServerError(e)
  }
}
