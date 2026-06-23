import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const data: any = {}
  if (body.name) data.name = body.name
  if (body.email) data.email = body.email
  if (body.password) data.password = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data,
    select: { id: true, name: true, email: true },
  })
  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (String(session.user?.id) === id)
    return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri.' }, { status: 422 })

  await prisma.user.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
