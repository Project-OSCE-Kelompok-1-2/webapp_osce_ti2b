# Daftar URL API - MOSAIC OSCE

## Informasi Umum

- **Base URL**: `http://localhost/api/v1` (development) atau `https://your-domain.com/api/v1` (production)
- **Autentikasi**: Bearer Token (Laravel Sanctum)
- **Format Data**: JSON
- **Version**: 1.0
- **OpenAPI Version**: 3.1.0

---

## Cara Menggunakan API

### 1. Login dan Mendapatkan Token

```bash
POST /api/v1/login
Content-Type: application/json

{
    "username": "your_username",
    "password": "your_password"
}

# Response:
{
    "message": "Login berhasil",
    "user": {...},
    "token": "1|abcdef123456..."
}
```

### 2. Menggunakan Token untuk Request

```bash
GET /api/v1/admin/dashboard
Authorization: Bearer 1|abcdef123456...
```

### 3. Logout

```bash
POST /api/v1/logout
Authorization: Bearer 1|abcdef123456...
```

---

## Daftar Endpoint API

| NO | URL | METHOD | PARAMETER | DESKRIPSI |
|----|-----|--------|-----------|-----------|
| **AUTENTIKASI** |||||
| 1 | `/login` | POST | `username`, `password` | Login pengguna dan mendapatkan token autentikasi |
| 2 | `/logout` | POST | - | Logout pengguna dan revoke token |
| 3 | `/me` | GET | - | Mendapatkan informasi user yang sedang login |
| **ADMIN - DASHBOARD & PROFIL** |||||
| 4 | `/admin/dashboard` | GET | - | Mengambil data dashboard admin (statistik, notifikasi) |
| 5 | `/admin/pengaturan-akun` | GET | - | Mengambil data profil admin |
| 6 | `/admin/pengaturan-akun` | POST | `foto`, `new_password`, `old_password`, `delete_foto`, `new_password_confirmation` | Memperbarui data admin (foto, password) |
| **ADMIN - MAHASISWA** |||||
| 7 | `/admin/mahasiswa` | GET | `search`, `angkatan` | Mengambil seluruh data mahasiswa dengan filter |
| 8 | `/admin/mahasiswa` | POST | `nim`, `nama`, `kelas`, `prodi` | Membuat data mahasiswa baru |
| 9 | `/admin/mahasiswa/{mahasiswa}` | GET | - | Mengambil data mahasiswa berdasarkan ID |
| 10 | `/admin/mahasiswa/{mahasiswa}` | PUT | `nim`, `nama`, `kelas`, `prodi` | Memperbarui data mahasiswa |
| 11 | `/admin/mahasiswa/{mahasiswa}` | DELETE | - | Menghapus data mahasiswa |
| 12 | `/admin/mahasiswa/import` | POST | `file` (Excel) | Mengimport data mahasiswa dari file Excel |
| **ADMIN - PENGUJI** |||||
| 13 | `/admin/penguji` | GET | `search` | Mengambil seluruh data penguji/dosen |
| 14 | `/admin/penguji` | POST | `nama`, `nip` | Membuat data penguji baru |
| 15 | `/admin/penguji/{penguji}` | PUT | `nama`, `nip` | Memperbarui data penguji |
| 16 | `/admin/penguji/{penguji}` | DELETE | - | Menghapus data penguji |
| **ADMIN - STASE** |||||
| 17 | `/admin/stase` | GET | `search` | Mengambil seluruh data stase (template rubrik) |
| 18 | `/admin/stase` | POST | `nama_stase`, `id_mata_kuliah`, `id_tujuan_pembelajaran`, `deskripsi` | Membuat data stase baru |
| 19 | `/admin/stase/{id_stase}` | GET | - | Mengambil data stase berdasarkan ID |
| 20 | `/admin/stase/{id}` | PUT | `nama_stase`, `id_mata_kuliah`, `id_tujuan_pembelajaran`, `deskripsi` | Memperbarui data stase |
| 21 | `/admin/stase/{id_stase}` | DELETE | - | Menghapus data stase |
| **ADMIN - ASPEK PENILAIAN** |||||
| 22 | `/admin/stase/{stase}/aspek-penilaian` | GET | `search` | Mengambil seluruh aspek penilaian dari stase tertentu |
| 23 | `/admin/stase/{stase}/aspek-penilaian` | POST | `aspek`, `bobot_maksimum` | Membuat aspek penilaian baru untuk stase |
| 24 | `/admin/stase/{stase}/aspek-penilaian/{id_aspek_penilaian}` | GET | - | Mengambil data aspek penilaian berdasarkan ID |
| 25 | `/admin/stase/{stase}/aspek-penilaian/{id_aspek_penilaian}` | PUT | `aspek`, `bobot_maksimum` | Memperbarui aspek penilaian |
| 26 | `/admin/stase/{stase}/aspek-penilaian/{id_aspek_penilaian}` | DELETE | - | Menghapus aspek penilaian |
| **ADMIN - KOMPETENSI** |||||
| 27 | `/admin/aspek-penilaian/{id_aspek}/kompetensi` | GET | `search` | Mengambil seluruh kompetensi dari aspek penilaian |
| 28 | `/admin/aspek-penilaian/{id_aspek}/kompetensi` | POST | `kompetensi`, `skor`, `bobot` | Membuat data kompetensi baru |
| 29 | `/admin/aspek-penilaian/{id}/kompetensi/{kompetensi}` | GET | - | Mengambil data kompetensi berdasarkan ID |
| 30 | `/admin/aspek-penilaian/{id_kompetensi}/kompetensi/{kompetensi}` | PUT | `kompetensi`, `skor`, `bobot` | Memperbarui data kompetensi |
| 31 | `/admin/aspek-penilaian/{id_kompetensi}/kompetensi/{kompetensi}` | DELETE | - | Menghapus data kompetensi |
| **ADMIN - OSCE** |||||
| 32 | `/admin/osce` | GET | `search`, `tahun` | Mengambil seluruh data ujian OSCE |
| 33 | `/admin/osce` | POST | `id_tahun_akademik`, `nama_osce`, `tanggal_mulai`, `tanggal_selesai` | Membuat data OSCE baru |
| 34 | `/admin/osce/{osce}` | PUT | `id_tahun_akademik`, `nama_osce`, `tanggal_mulai`, `tanggal_selesai` | Memperbarui data OSCE |
| 35 | `/admin/osce/{osce}` | DELETE | - | Menghapus data OSCE |
| **ADMIN - OSCE STASE** |||||
| 36 | `/admin/osce/{id_osce}/stase` | GET | `search` | Mengambil seluruh stase yang ditugaskan ke OSCE |
| 37 | `/admin/osce/{id_osce}/stase` | POST | `id_ruang`, `id_stase`, `id_penguji` | Menambahkan stase ke OSCE (assign ruang & penguji) |
| 38 | `/admin/osce/{id_osce}/stase/{osce_stase}` | PUT | `id_ruang`, `id_stase`, `id_penguji` | Memperbarui konfigurasi stase dalam OSCE |
| 39 | `/admin/osce/{id_osce}/stase/{id_osce_stase}` | DELETE | - | Menghapus stase dari OSCE |
| **ADMIN - JADWAL SESI OSCE** |||||
| 40 | `/admin/osce/{id_osce}/jadwal` | GET | `search` | Menampilkan daftar sesi jadwal per hari untuk OSCE |
| 41 | `/admin/osce/{id_osce}/jadwal` | POST | `tanggal`, `jam_mulai`, `jam_selesai`, `stase_ids[]` | Membuat sesi jadwal ujian baru |
| 42 | `/admin/osce/{id_osce}/jadwal/{sesi_id}` | PUT | `tanggal`, `jam_mulai`, `jam_selesai`, `stase_ids[]` | Mengupdate sesi jadwal ujian |
| 43 | `/admin/osce/{id_osce}/jadwal/{sesi_id}` | DELETE | - | Menghapus sesi jadwal ujian |
| **ADMIN - ENROLLMENT MAHASISWA** |||||
| 44 | `/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment` | GET | - | Menampilkan daftar mahasiswa dan status enrollment |
| 45 | `/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment` | POST | `id_mahasiswa_array[]` | Menyimpan perubahan enrollment (daftar mahasiswa yang ikut ujian) |
| **ADMIN - REKAP NILAI** |||||
| 46 | `/admin/rekap-nilai` | GET | `search`, `tahun` | List OSCE untuk rekapitulasi nilai |
| 47 | `/admin/rekap-nilai/{id_osce}/sesi` | GET | `search` | List sesi per OSCE untuk rekap nilai |
| 48 | `/admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa` | GET | `search`, `angkatan` | List mahasiswa per sesi dengan nilai |
| **PENGUJI - PROFIL** |||||
| 49 | `/penguji/profil` | GET | - | Mengambil data profil penguji |
| 50 | `/penguji/profil/update` | POST | `foto`, `new_password`, `old_password`, `delete_foto`, `new_password_confirmation` | Memperbarui profil penguji (foto, password) |
| **PENGUJI - PENILAIAN** |||||
| 51 | `/osce/{id_osce}/stase/{id_osce_stase}` | GET | - | Mengambil daftar antrian mahasiswa untuk dinilai |
| 52 | `/penilaian/{id_enrollment_osce}` | GET | - | Mengambil form rubrik penilaian untuk mahasiswa |
| 53 | `/penguji/penilaian/{id_enrollment_osce}` | POST | `nilai[]`, `feedback` | Menyimpan hasil penilaian mahasiswa |
| 54 | `/penguji/rotasi/{id_osce_stase}` | GET | - | Mendapatkan info mahasiswa selanjutnya dalam rotasi |
| 55 | `/penguji/selesai/{id_osce_stase}` | GET | - | Menandai sesi penilaian selesai |
| **PENGUJI - EDIT & VIEW NILAI** |||||
| 56 | `/penilaian/{id_enrollment_osce}/edit` | GET | - | Menampilkan form edit nilai mahasiswa |
| 57 | `/penilaian/{id_enrollment_osce}` | PUT | `nilai[]`, `feedback` | Memperbarui nilai mahasiswa yang sudah di-submit |
| 58 | `/penguji/penilaian/{id_enrollment_osce}/view` | GET | - | Melihat detail penilaian mahasiswa (read-only) |
| **MAHASISWA - DASHBOARD** |||||
| 59 | `/mahasiswa/dashboard` | GET | - | Mengambil data dashboard mahasiswa (jadwal, statistik) |
| **MAHASISWA - NILAI** |||||
| 60 | `/mahasiswa/nilai` | GET | - | Mengambil daftar riwayat ujian dan nilai mahasiswa |
| 61 | `/mahasiswa/nilai/{id}` | GET | - | Mengambil detail nilai ujian tertentu |
| **MAHASISWA - JADWAL** |||||
| 62 | `/mahasiswa/jadwal` | GET | - | Menampilkan jadwal ujian OSCE mahasiswa |
| **MAHASISWA - PROFIL** |||||
| 63 | `/mahasiswa/pengaturan-akun` | GET | - | Mengambil data profil mahasiswa |
| 64 | `/mahasiswa/pengaturan-akun` | POST | `foto`, `new_password`, `old_password`, `delete_foto`, `new_password_confirmation` | Memperbarui profil mahasiswa |

---

## Detail Parameter per Endpoint

### Autentikasi

#### 1. POST `/login`

**Request Body:**
```json
{
    "username": "string (required)",
    "password": "string (required)"
}
```

**Success Response (200):**
```json
{
    "message": "Login berhasil",
    "user": {
        "id_pengguna": 1,
        "username": "admin",
        "role": "admin"
    },
    "token": "1|abc123token456"
}
```

**Error Response (401):**
```json
{
    "message": "Username atau password salah"
}
```

---

#### 2. POST `/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
    "message": "Berhasil logout"
}
```

---

### Admin - Mahasiswa

#### 7. GET `/admin/mahasiswa`

**Query Parameters:**
- `search` (optional): string - Cari berdasarkan nama atau NIM
- `angkatan` (optional): string - Filter berdasarkan angkatan

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id_mahasiswa": 1,
                "nim": "2021001",
                "nama": "John Doe",
                "kelas": "TI-2A",
                "prodi": "Teknik Informatika"
            }
        ],
        "total": 100,
        "per_page": 15
    },
    "filters": {
        "search": null,
        "angkatan": null
    }
}
```

---

#### 8. POST `/admin/mahasiswa`

**Request Body:**
```json
{
    "nim": "string (required, max:20)",
    "nama": "string (required, max:255)",
    "kelas": "string (required, max:50)",
    "prodi": "string (required, max:100)"
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "message": "Mahasiswa baru berhasil ditambahkan.",
    "data": {
        "id_mahasiswa": 101,
        "nim": "2021001",
        "nama": "John Doe",
        "kelas": "TI-2A",
        "prodi": "Teknik Informatika"
    }
}
```

**Error Response (422):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "nim": ["NIM sudah terdaftar"],
        "nama": ["Nama harus diisi"]
    }
}
```

---

#### 12. POST `/admin/mahasiswa/import`

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (Excel file: .xlsx, .xls)

**Format Excel:**
| NIM | Nama | Kelas | Prodi |
|-----|------|-------|-------|
| 2021001 | John Doe | TI-2A | Teknik Informatika |

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Data mahasiswa berhasil diimpor."
}
```

---

### Admin - OSCE

#### 32. GET `/admin/osce`

**Query Parameters:**
- `search` (optional): string
- `tahun` (optional): string - Filter tahun akademik

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id_osce": 1,
            "nama_osce": "OSCE Semester Ganjil 2025",
            "tanggal_mulai": "2025-01-15",
            "tanggal_selesai": "2025-01-20",
            "tahun_akademik": "2024/2025",
            "detail_stase": "5 Stase",
            "detail_mahasiswa": "120 Mahasiswa",
            "detail_sesi": "10 Sesi"
        }
    ]
}
```

---

#### 33. POST `/admin/osce`

**Request Body:**
```json
{
    "id_tahun_akademik": "integer (required)",
    "nama_osce": "string (required, max:255)",
    "tanggal_mulai": "date (required, format: YYYY-MM-DD HH:mm:ss)",
    "tanggal_selesai": "date (required, format: YYYY-MM-DD HH:mm:ss)"
}
```

**Success Response (200/201):**
```json
{
    "success": true,
    "message": "OSCE berhasil dibuat",
    "data": {
        "id_osce": 5,
        "nama_osce": "OSCE Semester Ganjil 2025",
        "tanggal_mulai": "2025-01-15 08:00:00",
        "tanggal_selesai": "2025-01-20 17:00:00"
    }
}
```

---

### Admin - Jadwal Sesi

#### 41. POST `/admin/osce/{id_osce}/jadwal`

**Request Body:**
```json
{
    "tanggal": "date (required, format: YYYY-MM-DD HH:mm:ss)",
    "jam_mulai": "string (required, format: HH:mm)",
    "jam_selesai": "string (required, format: HH:mm)",
    "stase_ids": [
        "integer (required, min: 1 item)"
    ]
}
```

**Example:**
```json
{
    "tanggal": "2025-01-15 00:00:00",
    "jam_mulai": "08:00",
    "jam_selesai": "12:00",
    "stase_ids": [1, 2, 3]
}
```

**Success Response (201):**
```json
{
    "status": "success",
    "message": "Jadwal sesi berhasil dibuat!",
    "data": {
        "id_sesi": 10,
        "tanggal": "2025-01-15",
        "jam_mulai": "08:00",
        "jam_selesai": "12:00",
        "jumlah_stase": 3
    }
}
```

---

### Admin - Enrollment

#### 45. POST `/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment`

**Request Body:**
```json
{
    "id_mahasiswa_array": [
        1, 2, 3, 4, 5
    ]
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Enrollment berhasil disimpan",
    "data": {
        "enrolled": 5,
        "removed": 2
    }
}
```

---

### Penguji - Penilaian

#### 51. GET `/osce/{id_osce}/stase/{id_osce_stase}`

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "osce_detail": {
            "nama_osce": "OSCE Semester Ganjil",
            "nama_stase": "Radiologi",
            "ruangan": "R.101"
        },
        "antrian_mahasiswa": [
            {
                "id_enrollment_osce": 1,
                "id_mahasiswa": 101,
                "nim": "2021001",
                "nama": "John Doe",
                "status_penilaian": "belum_dinilai"
            },
            {
                "id_enrollment_osce": 2,
                "id_mahasiswa": 102,
                "nim": "2021002",
                "nama": "Jane Smith",
                "status_penilaian": "sudah_dinilai"
            }
        ]
    }
}
```

---

#### 52. GET `/penilaian/{id_enrollment_osce}`

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "mahasiswa": {
            "nama": "John Doe",
            "nim": "2021001",
            "prodi": "Teknik Informatika"
        },
        "rubrik": [
            {
                "id_aspek_penilaian": 1,
                "aspek": "Anamnesis",
                "bobot_maksimum": 20,
                "kompetensi": [
                    {
                        "id_poin_aspek_penilaian": 1,
                        "kompetensi": "Mampu melakukan anamnesis dengan baik",
                        "skor": 5,
                        "bobot": 1
                    }
                ]
            }
        ]
    }
}
```

---

#### 53. POST `/penguji/penilaian/{id_enrollment_osce}`

**Request Body:**
```json
{
    "nilai": [
        {
            "id_poin_aspek_penilaian": 1,
            "skor": 4
        },
        {
            "id_poin_aspek_penilaian": 2,
            "skor": 5
        }
    ],
    "feedback": "Mahasiswa sudah sangat baik dalam melakukan anamnesis"
}
```

**Success Response (200):**
```json
{
    "status": "success",
    "message": "Penilaian berhasil disimpan",
    "data": {
        "id_enrollment_osce": 1,
        "total_nilai": 85.5
    }
}
```

---

### Mahasiswa - Dashboard

#### 59. GET `/mahasiswa/dashboard`

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "nama_mahasiswa": "John Doe",
        "statistik": {
            "ujian_terdaftar": 3,
            "ujian_selesai": 5,
            "rata_rata_nilai": 85.2
        },
        "jadwal_penting": [
            {
                "id_osce": 1,
                "nama_osce": "OSCE Radiologi",
                "tanggal": "2025-01-20",
                "jam_mulai": "08:00",
                "hari_sisa": 2
            }
        ]
    }
}
```

---

### Mahasiswa - Nilai

#### 60. GET `/mahasiswa/nilai`

**Success Response (200):**
```json
{
    "status": "success",
    "data": [
        {
            "id_enrollment_osce": 1,
            "nama_osce": "OSCE Radiologi",
            "tanggal_ujian": "2025-01-15",
            "dosen_penguji": "Dr. Ahmad",
            "nilai_total": 85.5,
            "status_lulus": true
        }
    ]
}
```

---

#### 61. GET `/mahasiswa/nilai/{id}`

**Success Response (200):**
```json
{
    "status": "success",
    "data": {
        "detail_header": {
            "nama_ujian": "OSCE Radiologi",
            "nama_mahasiswa": "John Doe",
            "nim": "2021001",
            "dosen_penguji": "Dr. Ahmad"
        },
        "daftar_nilai": [
            {
                "aspek": "Anamnesis",
                "nilai": 85,
                "kompetensi": [
                    {
                        "kompetensi": "Komunikasi efektif",
                        "nilai": 4,
                        "bobot": 1
                    }
                ]
            }
        ],
        "rekap_akhir": {
            "total_nilai": 85.5,
            "status_kelulusan": "LULUS"
        },
        "feedback": "Mahasiswa menunjukkan kinerja yang sangat baik"
    }
}
```

---

## HTTP Status Codes

| Status Code | Deskripsi |
|-------------|-----------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Request tidak valid |
| 401 | Unauthorized - Token tidak valid atau tidak ada |
| 403 | Forbidden - Tidak memiliki akses ke resource |
| 404 | Not Found - Resource tidak ditemukan |
| 422 | Unprocessable Entity - Validasi gagal |
| 500 | Internal Server Error - Error di server |

---

## Rate Limiting

API menerapkan rate limiting untuk mencegah abuse:
- **Limit**: 60 requests per minute per IP address
- **Response Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

Jika limit terlampaui:
```json
{
    "message": "Too Many Requests"
}
```

---

## Pagination

Endpoint yang mengembalikan list data menggunakan pagination Laravel standar:

**Response Structure:**
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [...],
        "first_page_url": "http://localhost/api/v1/admin/mahasiswa?page=1",
        "last_page": 10,
        "last_page_url": "http://localhost/api/v1/admin/mahasiswa?page=10",
        "next_page_url": "http://localhost/api/v1/admin/mahasiswa?page=2",
        "prev_page_url": null,
        "per_page": 15,
        "total": 150
    }
}
```

**Query Parameter:**
- `page`: Nomor halaman (default: 1)
- `per_page`: Jumlah item per halaman (default: 15, max: 100)

---

## Testing API

### Menggunakan cURL

```bash
# Login
curl -X POST http://localhost/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get data dengan token
curl -X GET http://localhost/api/v1/admin/dashboard \
  -H "Authorization: Bearer 1|abc123token456"

# POST data
curl -X POST http://localhost/api/v1/admin/mahasiswa \
  -H "Authorization: Bearer 1|abc123token456" \
  -H "Content-Type: application/json" \
  -d '{"nim":"2021001","nama":"John Doe","kelas":"TI-2A","prodi":"Teknik Informatika"}'
```

### Menggunakan Postman

1. Import collection dari file `api.json` (OpenAPI spec)
2. Set environment variable `BASE_URL` = `http://localhost/api/v1`
3. Set environment variable `TOKEN` setelah login
4. Gunakan `{{BASE_URL}}` dan `{{TOKEN}}` dalam request

### Menggunakan Dokumentasi Interaktif

Akses dokumentasi API di browser:
```
http://localhost/docs/api
```

Fitur:
- Browse semua endpoint
- Try-it-out untuk testing langsung
- Lihat request/response schema
- Auto-generate code samples

---

## Kesimpulan

Daftar URL API di atas mencakup **64 endpoint** yang mengelola seluruh fungsionalitas aplikasi MOSAIC OSCE, meliputi:

- **Autentikasi & Otorisasi** (3 endpoint)
- **Admin Module** (45 endpoint)
  - Dashboard & Profil
  - Manajemen Mahasiswa
  - Manajemen Penguji
  - Manajemen Stase & Aspek Penilaian
  - Manajemen OSCE & Jadwal
  - Enrollment & Rekap Nilai
- **Penguji Module** (10 endpoint)
  - Profil
  - Penilaian Real-time
  - Edit & View Nilai
- **Mahasiswa Module** (6 endpoint)
  - Dashboard
  - Nilai & Jadwal
  - Profil

Semua endpoint menggunakan format JSON, autentikasi Bearer Token, dan mengikuti standar RESTful API best practices.
