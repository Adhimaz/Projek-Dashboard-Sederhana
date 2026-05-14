import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()

    const { nama, kode, stok, lokasi_rak } = body

    const barang = await prisma.barang.update({
      where: {
        id: params.id,
      },

      data: {
        nama,
        kode,
        stok: Number(stok),
        lokasi_rak,
      },
    })

    return NextResponse.json(barang)
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: "Gagal update barang" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    await prisma.barang.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: "Barang berhasil dihapus",
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: "Gagal hapus barang" },
      { status: 500 }
    )
  }
}