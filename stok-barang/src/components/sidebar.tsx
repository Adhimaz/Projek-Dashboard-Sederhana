"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">
        Stok Barang
      </h1>

      <div className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/barang">Barang</Link>
        <Link href="/transaksi">Transaksi</Link>
        <Link href="/users">Users</Link>
      </div>
    </div>
  )
}