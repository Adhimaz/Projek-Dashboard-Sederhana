import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}