import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET semua barang
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const barang = await prisma.barang.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(barang)
}

// POST tambah barang (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { nama, kode, stok, lokasi_rak } = body

  if (!nama || !kode || stok === undefined || !lokasi_rak) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
  }

  try {
    const barang = await prisma.barang.create({
      data: { nama, kode, stok: parseInt(stok), lokasi_rak },
    })
    // Emit realtime
    const io = (global as any).io
    if (io) io.emit('barang:updated', barang)

    return NextResponse.json(barang, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Kode barang sudah ada' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}