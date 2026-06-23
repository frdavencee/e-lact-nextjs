import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const lokasiId = Number(id)

  const existing = await prisma.project.findUnique({ where: { lokasi_id: lokasiId } })

  if (existing) {
    const project = await prisma.project.update({
      where: { lokasi_id: lokasiId },
      data: {
        name: body.name,
        contract_number: body.contract_number,
        purchase_order_number: body.purchase_order_number,
        implementer: body.implementer,
        waspang_id: body.waspang_id ? Number(body.waspang_id) : null,
        branch_id: body.branch_id ? Number(body.branch_id) : null,
      },
    })
    return NextResponse.json(project)
  }

  const project = await prisma.project.create({
    data: {
      lokasi_id: lokasiId,
      name: body.name,
      contract_number: body.contract_number,
      purchase_order_number: body.purchase_order_number,
      implementer: body.implementer,
      waspang_id: body.waspang_id ? Number(body.waspang_id) : null,
      branch_id: body.branch_id ? Number(body.branch_id) : null,
      user_id: session.user?.id ? Number(session.user.id) : null,
    },
  })
  return NextResponse.json(project, { status: 201 })
}
