"use client"

import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useState } from "react"

interface Barang {
  id: string
  nama: string
  kode: string
  stok: number
  lokasi_rak: string
}

interface Props {
  barang: Barang[]
}

export default function TableBarang({
  barang,
}: Props) {
  const router = useRouter()
  const [editData, setEditData] = useState<any>(null)

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      "Yakin ingin menghapus barang?"
    )

    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/barang/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Gagal hapus")
      }

      toast.success("Barang berhasil dihapus")

      router.refresh()
    } catch (error) {
      toast.error("Terjadi kesalahan")
    }
  }

  async function handleUpdate() {
  try {
    const res = await fetch(
      `/api/barang/${editData.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(editData),
      }
    )

    if (!res.ok) {
      throw new Error("Gagal update")
    }

    toast.success("Barang berhasil diupdate")

    setEditData(null)

    router.refresh()
  } catch (error) {
    toast.error("Terjadi kesalahan")
  }
}

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Data Barang
      </h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Kode</th>
            <th className="p-3 border">Stok</th>
            <th className="p-3 border">Rak</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {barang.map((item) => (
            <tr key={item.id}>
              <td className="p-3 border">
                {item.nama}
              </td>

              <td className="p-3 border">
                {item.kode}
              </td>

              <td className="p-3 border">
                {item.stok}
              </td>

              <td className="p-3 border">
                {item.lokasi_rak}
              </td>

              <td className="p-3 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditData(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h2 className="text-xl font-bold">
                Edit Barang
            </h2>

            <input
                type="text"
                value={editData.nama}
                onChange={(e) =>
                setEditData({
                    ...editData,
                    nama: e.target.value,
                })
                }
                className="w-full border p-3 rounded"
            />

            <input
                type="text"
                value={editData.kode}
                onChange={(e) =>
                setEditData({
                    ...editData,
                    kode: e.target.value,
                })
                }
                className="w-full border p-3 rounded"
            />

            <input
                type="number"
                value={editData.stok}
                onChange={(e) =>
                setEditData({
                    ...editData,
                    stok: Number(e.target.value),
                })
                }
                className="w-full border p-3 rounded"
            />

            <input
                type="text"
                value={editData.lokasi_rak}
                onChange={(e) =>
                setEditData({
                    ...editData,
                    lokasi_rak: e.target.value,
                })
                }
                className="w-full border p-3 rounded"
            />

            <div className="flex gap-2">
                <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                Simpan
                </button>

                <button
                onClick={() => setEditData(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded w-full"
                >
                Batal
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  )
}