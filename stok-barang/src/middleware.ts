import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/barang/:path*',
    '/transaksi/:path*',
    '/users/:path*',
  ],
}