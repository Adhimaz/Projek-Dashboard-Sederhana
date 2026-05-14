"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Users,
} from "lucide-react"

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Barang",
    href: "/barang",
    icon: Package,
  },
  {
    name: "Transaksi",
    href: "/transaksi",
    icon: ArrowLeftRight,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-10">
        Stock App
      </h1>

      <div className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon

          const active =
            pathname === menu.href

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}