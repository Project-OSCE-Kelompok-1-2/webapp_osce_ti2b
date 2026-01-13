# Proses Bisnis dan Interoperabilitas - MOSAIC OSCE

## 1. Tentang Aplikasi MOSAIC OSCE

**MOSAIC** (Management of Objective Structured Clinical Examination) adalah aplikasi web berbasis Laravel dan React yang dirancang untuk mengelola ujian OSCE (Objective Structured Clinical Examination) di institusi pendidikan kesehatan. Aplikasi ini mengimplementasikan konsep **interoperabilitas** melalui RESTful API yang memungkinkan integrasi dengan sistem eksternal.

### Teknologi yang Digunakan

**Backend:**
- PHP 8.2+ dengan Laravel 11
- Laravel Sanctum untuk autentikasi API berbasis token
- MySQL sebagai database
- Laravel DomPDF untuk export PDF
- Maatwebsite Excel untuk import/export data

**Frontend:**
- React 19 dengan Inertia.js (SPA)
- Vite untuk asset bundling
- Tailwind CSS untuk styling

**API & Dokumentasi:**
- RESTful API dengan format JSON
- Scramble untuk auto-generate API documentation (OpenAPI 3.1)
- Laravel Sanctum Bearer Token Authentication

---

## 2. Konsep Interoperabilitas dalam Aplikasi

### 2.1 Definisi Interoperabilitas

Interoperabilitas adalah kemampuan sistem untuk berinteraksi dan bertukar data dengan sistem lain secara efektif. Dalam konteks MOSAIC OSCE, interoperabilitas diterapkan melalui:

1. **RESTful API** - Menyediakan endpoint standar yang dapat diakses oleh aplikasi eksternal
2. **Format Data Standar** - Menggunakan JSON untuk pertukaran data
3. **Autentikasi Token-based** - Menggunakan Laravel Sanctum untuk keamanan API
4. **Dokumentasi API Terbuka** - Menyediakan dokumentasi OpenAPI 3.1 yang dapat diakses publik

### 2.2 Arsitektur Interoperabilitas

```
┌─────────────────────────────────────────────────────────────┐
│                    Aplikasi Eksternal                        │
│  (Sistem Akademik, Mobile App, Dashboard Analytics, dll)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP Request (JSON)
                           │ Authorization: Bearer {token}
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   RESTful API Gateway                        │
│                  (routes/api.php)                            │
├─────────────────────────────────────────────────────────────┤
│  • Authentication (Laravel Sanctum)                          │
│  • Rate Limiting                                             │
│  • Role-based Authorization                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              API Controllers (app/Http/Controllers/Api)      │
├─────────────────────────────────────────────────────────────┤
│  • Admin API Controllers                                     │
│  • Penguji API Controllers                                   │
│  • Mahasiswa API Controllers                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Business Logic Layer (Services)                 │
├─────────────────────────────────────────────────────────────┤
│  • MahasiswaService                                          │
│  • OsceService                                               │
│  • NilaiOsceService                                          │
│  • AspekPenilaianService                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                Data Access Layer (Models)                    │
├─────────────────────────────────────────────────────────────┤
│  • Eloquent ORM                                              │
│  • Relationships                                             │
│  • Data Validation                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     MySQL Database                           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Keuntungan Implementasi Interoperabilitas

1. **Integrasi Multi-Platform**: Aplikasi mobile, web, dan desktop dapat mengakses data yang sama
2. **Skalabilitas**: Sistem dapat berkembang dengan mudah dengan menambah consumer API baru
3. **Modularitas**: Backend dan frontend terpisah, memudahkan pengembangan dan maintenance
4. **Standarisasi**: Menggunakan protokol dan format standar industri (HTTP, JSON, OAuth)
5. **Reusabilitas**: API dapat digunakan kembali untuk berbagai keperluan (dashboard analytics, reporting, dll)

---

## 3. Proses Bisnis Aplikasi MOSAIC OSCE

### 3.1 Aktor dalam Sistem

1. **Admin** - Pengelola sistem, data master, dan konfigurasi ujian
2. **Penguji/Dosen** - Melakukan penilaian mahasiswa saat ujian berlangsung
3. **Mahasiswa** - Peserta ujian yang melihat jadwal dan nilai

### 3.2 Alur Proses Bisnis Utama

#### A. Manajemen Data Master (Admin)

```
[Admin Login] 
    ↓
[Dashboard Admin]
    ↓
[Kelola Data Master]
    ├─→ [Mahasiswa] - Tambah/Edit/Import mahasiswa dari Excel
    ├─→ [Penguji] - Tambah/Edit data dosen penguji
    ├─→ [Stase] - Buat template rubrik penilaian (station klinik)
    ├─→ [Aspek Penilaian] - Definisikan kriteria penilaian per stase
    └─→ [Kompetensi] - Tambah poin-poin kompetensi yang dinilai
```

**Implementasi Interoperabilitas:**
- API endpoint untuk CRUD data mahasiswa: `/api/v1/admin/mahasiswa`
- Import batch mahasiswa: `POST /api/v1/admin/mahasiswa/import`
- Sistem eksternal (misalnya Sistem Informasi Akademik) dapat mengirim data mahasiswa secara otomatis

#### B. Konfigurasi Ujian OSCE (Admin)

```
[Buat OSCE Baru]
    ↓
[Isi Detail OSCE]
    ├─→ Nama OSCE
    ├─→ Tahun Akademik
    ├─→ Tanggal Mulai & Selesai
    └─→ Simpan
    ↓
[Tambah Stase ke OSCE]
    ├─→ Pilih Stase (rubrik penilaian)
    ├─→ Assign Ruangan
    ├─→ Assign Penguji
    └─→ Simpan
    ↓
[Buat Jadwal Sesi Ujian]
    ├─→ Tentukan Tanggal
    ├─→ Jam Mulai & Selesai
    ├─→ Pilih Stase yang aktif di sesi ini
    └─→ Simpan
    ↓
[Enrollment Mahasiswa]
    ├─→ Pilih Sesi
    ├─→ Checklist Mahasiswa yang ikut ujian
    └─→ Simpan
    ↓
[OSCE Siap Dijalankan]
```

**Implementasi Interoperabilitas:**
- API untuk manajemen OSCE: `/api/v1/admin/osce`
- API untuk jadwal sesi: `/api/v1/admin/osce/{id_osce}/jadwal`
- API untuk enrollment: `/api/v1/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment`
- Sistem akademik dapat mendaftarkan mahasiswa secara otomatis via API

#### C. Pelaksanaan Ujian (Penguji)

```
[Penguji Login]
    ↓
[Dashboard Penguji] - Lihat jadwal ujian yang ditugaskan
    ↓
[Pilih OSCE & Stase]
    ↓
[Lihat Antrian Mahasiswa]
    ├─→ List mahasiswa yang akan dinilai
    └─→ Status: Belum Dinilai / Sudah Dinilai
    ↓
[Mulai Penilaian]
    ├─→ Sistem menampilkan rubrik penilaian
    ├─→ Timer berjalan (sesuai durasi yang ditentukan)
    ├─→ Penguji input nilai per kompetensi
    └─→ Tambahkan feedback (opsional)
    ↓
[Submit Nilai]
    ├─→ Nilai tersimpan ke database
    └─→ Mahasiswa berstatus "Sudah Dinilai"
    ↓
[Rotasi Mahasiswa Berikutnya]
    ├─→ Jika masih ada mahasiswa → Ulangi penilaian
    └─→ Jika selesai → Sesi Penilaian Selesai
```

**Implementasi Interoperabilitas:**
- API untuk antrian mahasiswa: `GET /api/v1/osce/{id_osce}/stase/{id_osce_stase}`
- API untuk submit nilai: `POST /api/v1/penguji/penilaian/{id_enrollment_osce}`
- API untuk edit nilai: `PUT /api/v1/penilaian/{id_enrollment_osce}`
- Aplikasi mobile penguji dapat dibangun menggunakan API ini

#### D. Monitoring dan Rekapitulasi (Admin & Penguji)

```
[Akses Menu Rekap Nilai]
    ↓
[Pilih OSCE]
    ↓
[Pilih Sesi/Tanggal]
    ↓
[Lihat Daftar Mahasiswa & Nilai]
    ├─→ Filter berdasarkan angkatan, nama, dll
    ├─→ Lihat nilai per stase
    └─→ Export PDF/Excel
    ↓
[Analisis & Laporan]
```

**Implementasi Interoperabilitas:**
- API rekap nilai: `/api/v1/admin/rekap-nilai`
- API detail nilai per sesi: `/api/v1/admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa`
- Sistem Business Intelligence eksternal dapat mengambil data untuk analytics

#### E. Akses Nilai (Mahasiswa)

```
[Mahasiswa Login]
    ↓
[Dashboard Mahasiswa]
    ├─→ Lihat jadwal ujian mendatang
    └─→ Notifikasi ujian penting
    ↓
[Menu Nilai]
    ↓
[Pilih OSCE]
    ↓
[Lihat Detail Nilai]
    ├─→ Nilai per aspek penilaian
    ├─→ Feedback dari penguji
    ├─→ Status kelulusan
    └─→ Download transkrip nilai (PDF)
```

**Implementasi Interoperabilitas:**
- API dashboard mahasiswa: `/api/v1/mahasiswa/dashboard`
- API jadwal: `/api/v1/mahasiswa/jadwal`
- API nilai: `/api/v1/mahasiswa/nilai`
- Portal mahasiswa eksternal dapat mengintegrasikan nilai OSCE

---

## 4. Skenario Interoperabilitas

### Skenario 1: Integrasi dengan Sistem Informasi Akademik (SIAKAD)

**Kebutuhan:** SIAKAD perlu otomatis mendaftarkan mahasiswa ke ujian OSCE

**Implementasi:**
```
[SIAKAD] 
    ↓ (1) Request list OSCE aktif
GET /api/v1/admin/osce
    ↓ (2) Response: [{id_osce, nama_osce, tanggal_mulai, ...}]
    ↓ (3) Request list jadwal untuk OSCE tertentu
GET /api/v1/admin/osce/{id_osce}/jadwal
    ↓ (4) Response: [{id_sesi, tanggal, jam_mulai, ...}]
    ↓ (5) Enroll mahasiswa ke sesi
POST /api/v1/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment
Body: {
    "id_mahasiswa_array": [101, 102, 103, ...]
}
    ↓ (6) Response: {status: "success", message: "..."}
```

### Skenario 2: Aplikasi Mobile untuk Penguji

**Kebutuhan:** Penguji ingin melakukan penilaian menggunakan tablet/smartphone

**Implementasi:**
```
[Mobile App] 
    ↓ (1) Login
POST /api/v1/login
Body: {username: "penguji001", password: "***"}
    ↓ (2) Dapat token
Response: {token: "1|abc123...", user: {...}}
    ↓ (3) Request antrian mahasiswa (dengan token di header)
GET /api/v1/osce/{id_osce}/stase/{id_osce_stase}
Header: Authorization: Bearer 1|abc123...
    ↓ (4) Response: {antrian_mahasiswa: [...]}
    ↓ (5) Mulai penilaian mahasiswa
GET /api/v1/penilaian/{id_enrollment_osce}
    ↓ (6) Response: {rubrik: [...], mahasiswa: {...}}
    ↓ (7) Submit nilai
POST /api/v1/penguji/penilaian/{id_enrollment_osce}
Body: {
    "nilai": [{id_poin_aspek_penilaian: 1, skor: 4}, ...],
    "feedback": "..."
}
    ↓ (8) Response: {status: "success"}
```

### Skenario 3: Dashboard Analytics untuk Manajemen

**Kebutuhan:** Manajemen ingin melihat statistik dan tren nilai OSCE

**Implementasi:**
```
[Dashboard BI]
    ↓ (1) Request semua OSCE
GET /api/v1/admin/osce
    ↓ (2) Request rekap nilai per OSCE
GET /api/v1/admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa
    ↓ (3) Proses data untuk visualisasi
    ├─→ Rata-rata nilai per stase
    ├─→ Persentase kelulusan
    ├─→ Tren nilai dari waktu ke waktu
    └─→ Performa penguji
    ↓ (4) Tampilkan chart dan graph
```

### Skenario 4: Portal Mahasiswa Terintegrasi

**Kebutuhan:** Portal mahasiswa institusi menampilkan nilai OSCE bersama nilai lain

**Implementasi:**
```
[Portal Mahasiswa]
    ↓ (1) Mahasiswa login di portal
    ↓ (2) Portal request nilai OSCE via API (server-to-server)
GET /api/v1/mahasiswa/nilai
Header: Authorization: Bearer {server_token}
    ↓ (3) Response: {data: [{id_osce, nama_osce, nilai_total, ...}]}
    ↓ (4) Portal menampilkan nilai OSCE bersama nilai mata kuliah lain
    ↓ (5) Mahasiswa klik detail nilai
    ↓ (6) Portal request detail
GET /api/v1/mahasiswa/nilai/{id}
    ↓ (7) Response: {daftar_nilai: [...], rekap_akhir: {...}}
    ↓ (8) Portal menampilkan transkrip nilai
```

---

## 5. Keamanan dan Autentikasi API

### 5.1 Laravel Sanctum Bearer Token

MOSAIC OSCE menggunakan **Laravel Sanctum** untuk autentikasi API berbasis token:

1. **Login**: Client mengirim username & password ke `/api/v1/login`
2. **Token Generation**: Server memvalidasi dan mengembalikan Bearer token
3. **Request dengan Token**: Client menyertakan token di header untuk setiap request:
   ```
   Authorization: Bearer {token}
   ```
4. **Logout**: Client mengirim request ke `/api/v1/logout` untuk revoke token

### 5.2 Role-based Authorization

API menerapkan **role-based access control** dengan middleware:

- `roleApi:admin` - Hanya admin yang dapat mengakses
- `roleApi:penguji` - Hanya penguji yang dapat mengakses
- `roleApi:mahasiswa` - Hanya mahasiswa yang dapat mengakses

Contoh implementasi di `routes/api.php`:
```php
Route::prefix('admin')
    ->middleware('roleApi:admin')
    ->group(function () {
        Route::apiResource('osce', OsceController::class);
        Route::apiResource('mahasiswa', MahasiswaController::class);
        // ...
    });
```

### 5.3 Data Validation

Setiap request API divalidasi menggunakan Laravel Form Request:

- Format data harus sesuai dengan schema yang ditentukan
- Error validasi akan mengembalikan HTTP 422 dengan detail error
- Mencegah SQL injection dan data corruption

---

## 6. Format Response API

### 6.1 Success Response

```json
{
    "status": "success",
    "message": "Operasi berhasil",
    "data": {
        // ... data yang diminta
    }
}
```

### 6.2 Error Response - Validation (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "nama": ["Nama harus diisi"],
        "nim": ["NIM sudah terdaftar"]
    }
}
```

### 6.3 Error Response - Unauthorized (401)

```json
{
    "message": "Unauthenticated"
}
```

### 6.4 Error Response - Not Found (404)

```json
{
    "message": "Data tidak ditemukan"
}
```

---

## 7. Dokumentasi API Otomatis

MOSAIC OSCE menggunakan **Scramble** untuk auto-generate dokumentasi API dalam format **OpenAPI 3.1**. Dokumentasi dapat diakses di:

- **Endpoint Dokumentasi**: `/docs/api`
- **File OpenAPI JSON**: `api.json` (di root project)

Dokumentasi ini menyediakan:
- Daftar semua endpoint API
- Request/response schema
- Parameter yang diperlukan
- Contoh request & response
- Try-it-out feature untuk testing langsung

---

## 8. Kesimpulan

Aplikasi MOSAIC OSCE mengimplementasikan **interoperabilitas** dengan baik melalui:

1. **RESTful API** yang lengkap dan terstruktur
2. **Autentikasi berbasis token** (Laravel Sanctum) yang aman
3. **Role-based authorization** untuk kontrol akses
4. **Format JSON standar** untuk pertukaran data
5. **Dokumentasi OpenAPI 3.1** yang lengkap dan mudah diakses
6. **Service Layer Architecture** yang memisahkan business logic dari API controller

Dengan implementasi ini, MOSAIC OSCE dapat dengan mudah diintegrasikan dengan sistem eksternal seperti:
- Sistem Informasi Akademik (SIAKAD)
- Aplikasi mobile untuk penguji dan mahasiswa
- Dashboard analytics dan business intelligence
- Portal mahasiswa terintegrasi
- Sistem pelaporan dan monitoring

**Prinsip Interoperabilitas yang Diterapkan:**
- ✅ **Standardization**: Menggunakan HTTP, JSON, dan OpenAPI standard
- ✅ **Modularity**: Backend API terpisah dari frontend
- ✅ **Security**: Token-based authentication dan role-based authorization
- ✅ **Documentation**: Auto-generated API documentation
- ✅ **Scalability**: Arsitektur yang dapat berkembang dengan mudah
- ✅ **Reusability**: API dapat digunakan untuk berbagai client aplikasi
