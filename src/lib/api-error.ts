import { NextResponse } from 'next/server'

export function apiServerError(e: unknown) {
  console.error(e)
  const msg = e instanceof Error ? e.message : 'Terjadi kesalahan server.'
  return NextResponse.json({ error: msg }, { status: 500 })
}
