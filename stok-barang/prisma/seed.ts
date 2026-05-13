import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  // Hapus data lama
  await prisma.transaksi.deleteMany()
  await prisma.barang.deleteMany()
  await prisma.user.deleteMany()

  // Buat Admin
  const adminPass = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator',
      username: 'admin',
      password: adminPass,
      role: 'ADMIN',
    },
  })

  // Buat Operator
  const opPass = await bcrypt.hash('operator123', 10)
  const operator = await prisma.user.create({
    data: {
      name: 'Operator Satu',
      username: 'operator1',
      password: opPass,
      role: 'OPERATOR',
    },
  })

  // Buat Barang
  const barang1 = await prisma.barang.create({
    data: { nama: 'Laptop Lenovo', kode: 'LPT-001', stok: 25, lokasi_rak: 'A1' },
  })
  const barang2 = await prisma.barang.create({
    data: { nama: 'Mouse Logitech', kode: 'MOU-001', stok: 8, lokasi_rak: 'B2' },
  })
  const barang3 = await prisma.barang.create({
    data: { nama: 'Keyboard Mechanical', kode: 'KBD-001', stok: 5, lokasi_rak: 'B3' },
  })

  console.log('Seed berhasil!', { admin: admin.username, operator: operator.username })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })