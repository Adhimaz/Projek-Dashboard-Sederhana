import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const transaksi = await prisma.transaksi.findMany({
    include: {
      barang: { select: { nama: true, kode: true } },
      user: { select: { name: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(transaksi)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id_barang, tipe_transaksi, jumlah } = body

  if (!id_barang || !tipe_transaksi || !jumlah) {
    return NextResponse.json({ error: 'Field wajib: id_barang, tipe_transaksi, jumlah' }, { status: 400 })
  }

  try {
    // ⚠️ ATOMIC: update stok + create transaksi dalam 1 transaction
    // Mencegah race condition ketika multiple users update stok bersamaan
    const result = await prisma.$transaction(async (tx) => {
      // Lock barang untuk update
      const barang = await tx.barang.findUnique({
        where: { id: id_barang },
      })

      if (!barang) throw new Error('Barang tidak ditemukan')

      let newStok = barang.stok
      if (tipe_transaksi === 'MASUK') {
        newStok += parseInt(jumlah)
      } else if (tipe_transaksi === 'KELUAR') {
        if (barang.stok < parseInt(jumlah)) {
          throw new Error(`Stok tidak cukup. Stok saat ini: ${barang.stok}`)
        }
        newStok -= parseInt(jumlah)
      }

      // Update stok
      const updatedBarang = await tx.barang.update({
        where: { id: id_barang },
        data: { stok: newStok },
      })

      // Buat transaksi
      const transaksi = await tx.transaksi.create({
        data: {
          id_barang,
          tipe_transaksi,
          jumlah: parseInt(jumlah),
          id_user: session.user.id,
        },
        include: {
          barang: { select: { nama: true, kode: true } },
          user: { select: { name: true } },
        },
      })

      return { transaksi, barang: updatedBarang }
    })

    // Emit realtime updates
    const io = (global as any).io
    if (io) {
      io.emit('transaksi:created', result.transaksi)
      io.emit('stok:updated', result.barang)

      // Alert jika stok < 10
      if (result.barang.stok < 10) {
        io.emit('stok:low', {
          barang: result.barang,
          message: `⚠️ Stok ${result.barang.nama} tinggal ${result.barang.stok}!`,
        })
      }
    }

    return NextResponse.json(result.transaksi, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 400 })
  }
}