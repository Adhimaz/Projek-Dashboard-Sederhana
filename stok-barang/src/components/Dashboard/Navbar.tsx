"use client"

import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">
        Dashboard Stok Barang
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">
            {session?.user?.name}
          </p>

          <p className="text-sm text-gray-500">
            {session?.user?.role}
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  )
}