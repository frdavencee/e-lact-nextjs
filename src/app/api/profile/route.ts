import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { apiServerError } from '@/lib/api-error'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data: any = {}
    if (body.name) data.name = body.name
    if (body.password) {
      if (!body.current_password)
        return NextResponse.json({ error: 'Password lama wajib diisi.' }, { status: 422 })
      const user = await prisma.user.findUnique({ where: { id: Number(session.user.id) } })
      const valid = user && await bcrypt.compare(body.current_password, user.password)
      if (!valid)
        return NextResponse.json({ error: 'Password lama salah.' }, { status: 422 })
      data.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data,
      select: { id: true, name: true, email: true },
    })
    return NextResponse.json(user)
  } catch (e) {
    return apiServerError(e)
  }
}
