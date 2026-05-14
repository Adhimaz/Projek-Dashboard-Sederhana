import FormBarang from "@/components/FormBarang"
import TableBarang from "@/components/TabelBarang"
import { prisma } from "@/lib/prisma"

export default async function BarangPage() {
  const barang = await prisma.barang.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6 space-y-6">
      <FormBarang />

      <TableBarang barang={barang} />
    </div>
  )
}