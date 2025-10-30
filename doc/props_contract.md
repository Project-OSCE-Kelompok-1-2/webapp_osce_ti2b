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

## Stase

### 1. Menampilkan Semua stase
- **Endpoint**: `/stase`
- **Method**: `GET`
- **Deskripsi**: Mengambil semua data dari tabel `stase`.
  > **Catatan untuk Filter**: Filter dapat diimplementasikan menggunakan *query parameters*, contoh: `/stase?jurusan=RPL` atau `/stase?status=true`.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "nama": "string",
    "jumlah_aspek": "integer",
  }
]
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

### 2. Menambah stase Baru
- **Endpoint**: `/stase/tambah`
- **Method**: `POST`
- **Deskripsi**: Menambah data baru ke tabel `stase`.

**Request Body:**
```json
{
  "nama": "string",
}
```
**Optional Query Parameter:**
- `flash`: `string` (Untuk pesan notifikasi)

### 3. Menampilkan aspek penilaian tiap stase
- **Endpoint**: `/stase/{id}/aspek`
- **Method**: `GET`
- **Deskripsi**: Mengambil data aspek dari (`aspek_penilaian`) berdasarkan `id` stase.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "nama": "string",
    "bobot maksimum": "integer",
    "jumlah_kompetensi": "integer",
  }
]
```
### 4. Tambah aspek penilaian per stase
- **Endpoint**: `/stase/{id}/aspek/{id}`
- **Method**: `GET`
- **Deskripsi**: Mengambil data dari aspek_penillaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "nama": "string",
    "bobot maksimum": "integer",
  }
]
```
---
- **Endpoint**: `/stase/{id}/aspek/{id}`
- **Method**: `POST atau PUT`
- **Deskripsi**: Mengubah data yang ada di table aspek_penilaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "nama": "string",
    "bobot maksimum": "integer",
  }
]
```
---
### 5. Tambah Kompetensi per stase
- **Endpoint**: `/stase/{id}/aspek/{id}/kompetensi`
- **Method**: `GET`
- **Deskripsi**: Mengambil data dari poin_aspek_penilain.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "deskripsi": "string"
    "bobot": "integer"
  }
]
```
---
- **Endpoint**: `/stase/{id}/aspek/{id}/kompetensi`
- **Method**: `POST atau PUT`
- **Deskripsi**: Mengubah data di table poin_aspek_penilaian.

**Response Body (Contoh Array):**
```json
[
  {
    "id": "integer",
    "deskripsi": "string"
    "bobot": "integer"
  }
]
```
---
