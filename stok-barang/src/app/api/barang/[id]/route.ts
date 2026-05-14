import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Params {
  params: Promise<{
    id: string
  }>
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params  // await di sini
  try {
    const body = await req.json()
    const { nama, kode, stok, lokasi_rak } = body

    const barang = await prisma.barang.update({
      where: { id },  // pakai id dari await
      data: { nama, kode, stok: Number(stok), lokasi_rak },
    })

    return NextResponse.json(barang)
  } catch (error) {
    return NextResponse.json({ message: "Gagal update barang" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params  // await di sini
  try {
    await prisma.barang.delete({ where: { id } })
    return NextResponse.json({ message: "Barang berhasil dihapus" })
  } catch (error) {
    return NextResponse.json({ message: "Gagal hapus barang" }, { status: 500 })
  }
}