import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  scenarios: {
    race_condition: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export function setup() {
  // =========================
  // 1. Ambil CSRF token NextAuth
  // =========================
  const csrfRes = http.get(
    `${BASE_URL}/api/auth/csrf`
  )

  const csrfBody = JSON.parse(csrfRes.body)
  const csrfToken = csrfBody.csrfToken

  // =========================
  // 2. Login NextAuth Credentials
  // =========================
  const loginRes = http.post(
    `${BASE_URL}/api/auth/callback/credentials`,
    {
      username: 'operator1',
      password: 'operator123',
      csrfToken,
      json: 'true',
    },
    {
      redirects: 0,
    }
  )

  // =========================
  // 3. Ambil cookies session
  // =========================
  const cookies = loginRes.headers['Set-Cookie']

  if (!cookies) {
    console.error('Login gagal')
    return null
  }

  // =========================
  // 4. Ambil data barang
  // =========================
  const barangRes = http.get(
    `${BASE_URL}/api/barang`,
    {
      headers: {
        Cookie: cookies,
      },
    }
  )

  // Debug response
  console.log('STATUS BARANG:', barangRes.status)
  console.log('BODY BARANG:', barangRes.body)

  if (barangRes.status !== 200) {
    console.error('Gagal ambil barang')
    return null
  }

  const list = JSON.parse(barangRes.body)

  if (!list.length) {
    console.error('Data barang kosong')
    return null
  }

  return {
    barangId: list[0].id,
    cookies,
  }
}

export default function (data) {
  if (!data || !data.barangId) {
    console.error('Barang ID tidak ditemukan')
    return
  }

  const tipe =
    Math.random() > 0.5
      ? 'MASUK'
      : 'KELUAR'

  const payload = JSON.stringify({
    id_barang: data.barangId,
    tipe_transaksi: tipe,
    jumlah: 1,
  })

  const res = http.post(
    `${BASE_URL}/api/transaksi`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: data.cookies,
      },
    }
  )

  check(res, {
    'status 201/400': (r) =>
      r.status === 201 || r.status === 400,

    'response < 2s': (r) =>
      r.timings.duration < 2000,
  })

  if (res.status !== 201) {
    console.log('ERROR:', res.body)
  }

  sleep(0.1)
}