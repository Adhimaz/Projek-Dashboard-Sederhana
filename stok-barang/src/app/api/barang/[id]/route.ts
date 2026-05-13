import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const barang = await prisma.barang.findUnique({ where: { id: params.id } })
  if (!barang) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })

  return NextResponse.json(barang)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { nama, kode, stok, lokasi_rak } = body

  try {
    const barang = await prisma.barang.update({
      where: { id: params.id },
      data: { nama, kode, stok: parseInt(stok), lokasi_rak },
    })
    const io = (global as any).io
    if (io) io.emit('barang:updated', barang)

    return NextResponse.json(barang)
  } catch (err) {
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.barang.delete({ where: { id: params.id } })
  const io = (global as any).io
  if (io) io.emit('barang:deleted', { id: params.id })

  return NextResponse.json({ message: 'Berhasil dihapus' })
}