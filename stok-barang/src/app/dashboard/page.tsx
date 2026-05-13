'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getSocket } from '@/lib/socket'
import toast from 'react-hot-toast'

interface Stats {
  totalBarang: number
  totalTransaksi: number
  stokRendah: number
  transaksiHariIni: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({ totalBarang: 0, totalTransaksi: 0, stokRendah: 0, transaksiHariIni: 0 })
  const [barang, setBarang] = useState<any[]>([])

  useEffect(() => {
    fetchData()

    const socket = getSocket()
    socket.on('stok:low', (data: any) => {
      toast.error(data.message, { duration: 5000, icon: '⚠️' })
    })
    socket.on('stok:updated', () => fetchData())
    socket.on('transaksi:created', () => fetchData())

    return () => {
      socket.off('stok:low')
      socket.off('stok:updated')
      socket.off('transaksi:created')
    }
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/barang')
    const data = await res.json()
    setBarang(data)

    const resT = await fetch('/api/transaksi')
    const transaksiData = await resT.json()

    const today = new Date().toDateString()
    const todayCount = transaksiData.filter(
      (t: any) => new Date(t.createdAt).toDateString() === today
    ).length

    setStats({
      totalBarang: data.length,
      stokRendah: data.filter((b: any) => b.stok < 10).length,
      totalTransaksi: transaksiData.length,
      transaksiHariIni: todayCount,
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard — Selamat datang, {session?.user.name} ({session?.user.role})
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Barang" value={stats.totalBarang} color="blue" icon="📦" />
        <StatCard title="Total Transaksi" value={stats.totalTransaksi} color="green" icon="📋" />
        <StatCard title="Stok Rendah (<10)" value={stats.stokRendah} color="red" icon="⚠️" />
        <StatCard title="Transaksi Hari Ini" value={stats.transaksiHariIni} color="purple" icon="📅" />
      </div>

      {/* Tabel Stok Rendah */}
      {barang.filter(b => b.stok < 10).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h2 className="text-red-700 font-bold mb-3">⚠️ Barang dengan Stok Rendah ({'<'}10)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-red-600">
                <th className="pb-2">Nama Barang</th>
                <th className="pb-2">Kode</th>
                <th className="pb-2">Stok</th>
                <th className="pb-2">Lokasi Rak</th>
              </tr>
            </thead>
            <tbody>
              {barang.filter(b => b.stok < 10).map((b: any) => (
                <tr key={b.id} className="border-t border-red-100">
                  <td className="py-1">{b.nama}</td>
                  <td className="py-1 font-mono">{b.kode}</td>
                  <td className="py-1">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      {b.stok}
                    </span>
                  </td>
                  <td className="py-1">{b.lokasi_rak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, color, icon }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  )
}