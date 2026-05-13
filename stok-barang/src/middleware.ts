export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/barang/:path*', '/transaksi/:path*', '/users/:path*'],
}