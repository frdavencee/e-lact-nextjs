import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiServerError } from '@/lib/api-error'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const { imageId } = await params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.commissioningTestImage.delete({ where: { id: Number(imageId) } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return apiServerError(e)
  }
}
