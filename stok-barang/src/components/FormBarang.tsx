"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function FormBarang() {
  const router = useRouter()

  const [nama, setNama] = useState("")
  const [kode, setKode] = useState("")
  const [stok, setStok] = useState(0)
  const [lokasiRak, setLokasiRak] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await fetch("/api/barang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nama,
          kode,
          stok,
          lokasi_rak: lokasiRak,
        }),
      })

      if (!res.ok) {
        throw new Error("Gagal tambah barang")
      }

      toast.success("Barang berhasil ditambahkan")

      setNama("")
      setKode("")
      setStok(0)
      setLokasiRak("")

      router.refresh()
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Tambah Barang</h2>

      <input
        type="text"
        placeholder="Nama Barang"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="text"
        placeholder="Kode Barang"
        value={kode}
        onChange={(e) => setKode(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="number"
        placeholder="Stok"
        value={stok}
        onChange={(e) => setStok(Number(e.target.value))}
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="text"
        placeholder="Lokasi Rak"
        value={lokasiRak}
        onChange={(e) => setLokasiRak(e.target.value)}
        className="w-full border p-3 rounded-lg"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full"
      >
        {loading ? "Loading..." : "Tambah Barang"}
      </button>
    </form>
  )
}