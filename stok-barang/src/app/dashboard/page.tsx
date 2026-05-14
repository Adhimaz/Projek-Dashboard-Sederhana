import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { signOut } from "next-auth/react"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">
            Total Barang
          </h2>

          <p className="text-3xl font-bold mt-2">
            120
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">
            Barang Masuk
          </h2>

          <p className="text-3xl font-bold mt-2">
            56
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">
            Barang Keluar
          </h2>

          <p className="text-3xl font-bold mt-2">
            21
          </p>
        </div>
      </div>
    </div>
  )
}