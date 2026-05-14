import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const barang = await prisma.barang.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(barang)
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { nama, kode, stok, lokasi_rak } = body

    if (!nama || !kode || !lokasi_rak) {
      return NextResponse.json(
        { message: "Data belum lengkap" },
        { status: 400 }
      )
    }

    const barang = await prisma.barang.create({
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
      { message: "Gagal menambah barang" },
      { status: 500 }
    )
  }
}