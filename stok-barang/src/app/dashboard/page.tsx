import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-3">
        Selamat datang, {session?.user?.name}
      </p>

      <p>Role: {session?.user?.role}</p>
    </div>
  )
}