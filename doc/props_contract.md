# Props Contract (API Documentation)

Dokumentasi ini menjelaskan _endpoints_ yang tersedia pada API.

---

## Authentication

### 1. Login
- **Endpoint**: `/login`
- **Method**: `POST`
- **Deskripsi**: Mengautentikasi pengguna dengan `username` dan `password`.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

---

## Admin

### 1. Halaman Utama Admin
- **Endpoint**: `/admin/dashboard`
- **Method**: `GET`
- **Deskripsi**: *[Belum didefinisikan]*

---

### 2. Pengaturan Akun Admin

#### a. Mendapatkan Profil Admin
- **Endpoint**: `/admin/profil`
- **Method**: `GET`
- **Deskripsi**: Mengambil data profil admin yang sedang login.

**Response Body:**
```json
{
  "username": "string",
  "password": "string",
  "gambar": "string"
}
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

#### b. Memperbarui Password Admin
- **Endpoint**: `/admin/profil`
- **Method**: `PUT` atau `PATCH`
- **Deskripsi**: Mengubah atau memperbarui password admin.
  > **Catatan**: Gunakan `PUT` jika Anda mengganti seluruh sumber daya, atau `PATCH` untuk pembaruan parsial (hanya password). `POST` biasanya untuk membuat data baru.

**Request Body:**
```json
{
  "new_password": "string"
}
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

---

## Rubrik Penilaian

### 1. Menampilkan Semua Rubrik
- **Endpoint**: `/rubrik`
- **Method**: `GET`
- **Deskripsi**: Mengambil semua data dari tabel `aspek_penilaian`.
  > **Catatan untuk Filter**: Filter dapat diimplementasikan menggunakan *query parameters*, contoh: `/rubrik?jurusan=RPL` atau `/rubrik?status=true`.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "nama": "string",
    "jumlah_kompetensi": "integer",
    "status": "boolean"
  }
]
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

### 2. Menambah Rubrik Baru
- **Endpoint**: `/rubrik/tambah`
- **Method**: `POST`
- **Deskripsi**: Menambah data baru ke tabel `aspek_penilaian`.

**Request Body:**
```json
{
  "nama": "string",
  "jumlah_kompetensi": "integer",
  "jurusan_rubrik": "string"
}
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

### 3. Menampilkan Detail Kompetensi per Rubrik
- **Endpoint**: `/rubrik/{id}/kompetensi`
- **Method**: `GET`
- **Deskripsi**: Mengambil data kompetensi (`poin_aspek_penilaian`) berdasarkan `id` rubrik.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "deskripsi": "string",
    "bobot": "integer",
    "skor": "integer",
    "keterangan_skor": "string"
  }
]
```
### 4. Tambah kompetensi per Rubrik
- **Endpoint**: `/rubrik/{id}/kompetensi/{id}`
- **Method**: `GET`
- **Deskripsi**: Mengambil data dari poin_aspek_penilaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "deskripsi": "string",
    "bobot": "integer",
    "skor": "integer",
    "keterangan_skor": "string"
  }
]
```
---
- **Endpoint**: `/rubrik/{id}/kompetensi/{id}`
- **Method**: `POST atau PUT`
- **Deskripsi**: Mengubah data yang ada di table poin_aspek_penilaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "deskripsi": "string",
    "bobot": "integer",
    "skor": "integer",
    "keterangan_skor": "string"
  }
]
```
---
### 5. Tambah Deskripsi Nilai
- **Endpoint**: `/rubrik/{id}/nilai`
- **Method**: `GET`
- **Deskripsi**: Mengambil data dari aspek_penilain.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "keterangan_skor": "string"
  }
]
```
---
- **Endpoint**: `/rubrik/{id}/nilai`
- **Method**: `POST atau PUT`
- **Deskripsi**: Mengubah data di table aspek_penilaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "keterangan_skor": "string"
  }
]
```
---
