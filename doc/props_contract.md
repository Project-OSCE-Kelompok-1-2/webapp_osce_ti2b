

# Props Contract (API Documentation)

Dokumentasi ini menjelaskan *endpoints* yang tersedia pada API.

-----

## Authentication

### 1\. Login

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

-----

## Admin

### 1\. Halaman Utama Admin

  - **Endpoint**: `/admin/dashboard`
  - **Method**: `GET`
  - **Deskripsi**: *[Belum didefinisikan]*

-----

### 2\. Pengaturan Akun Admin

#### a. Mendapatkan Profil Admin

  - **Endpoint**: `/admin/profil`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil data profil admin yang sedang login (data dari model `Pengguna`).

**Response Body:**

```json
{
  "username": "string",
  "path_gambar": "string"
}
```

**Optional Query Parameter:**

  - `flash`: `string` (Untuk pesan notifikasi)

#### b. Memperbarui Password Admin

  - **Endpoint**: `/admin/profil`
  - **Method**: `PUT` atau `PATCH`
  - **Deskripsi**: Mengubah atau memperbarui password admin.

**Request Body:**

```json
{
  "password": "string"
}
```

**Optional Query Parameter:**

  - `flash`: `string` (Untuk pesan notifikasi)

-----

## OSCE (Ujian)

Bagian ini mengelola seluruh alur ujian OSCE, mulai dari pembuatan, konfigurasi stase, penjadwalan, hingga pendaftaran (enrollment) mahasiswa.

### 1\. Menampilkan Semua Ujian OSCE

  - **Endpoint**: `/admin/osce`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil daftar semua ujian OSCE (data dari model `Osce`).
  - **Query Parameters**:
      - `search`: `string`
      - `tahun`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_osce": "integer",
    "nama_osce": "string",
    "detail_stase": "string",     // Data terkomputasi untuk UI
    "detail_mahasiswa": "string", // Data terkomputasi untuk UI
    "detail_sesi": "string",      // Data terkomputasi untuk UI
    "tanggal_mulai": "date",
    "tanggal_selesai": "date",
    "tahun_akademik": "string"  // Data dari relasi TahunAkademik
  }
]
```

### 2\. Menambah Ujian OSCE Baru

  - **Endpoint**: `/admin/osce`
  - **Method**: `POST`
  - **Deskripsi**: Membuat ujian OSCE baru (menyimpan ke model `Osce`).

**Request Body:**

```json
{
  "nama_osce": "string",
  "id_tahun_akademik": "integer",
  "tanggal_mulai": "date",
  "tanggal_selesai": "date"
}
```

### 3\. Menampilkan Stase dalam OSCE

  - **Endpoint**: `/admin/osce/{id}/stase`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar stase yang telah ditugaskan ke OSCE (data dari model `OsceStase` dengan relasi).
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_osce_stase": "integer",
    "ruang": { // Relasi Ruang
      "nomor_ruangan": "string"
    },
    "stase": { // Relasi Stase
      "nama_stase": "string"
    },
    "penguji": { // Relasi Penguji
      "nama": "string"
    }
  }
]
```

### 4\. Menambahkan Stase ke OSCE

  - **Endpoint**: `/admin/osce/{id}/stase`
  - **Method**: `POST`
  - **Deskripsi**: Menambahkan dan mengkonfigurasi stase baru untuk OSCE (menyimpan ke model `OsceStase`).

**Request Body:**

```json
{
  "id_ruang": "integer",
  "id_stase": "integer",
  "id_penguji": "integer"
  // Catatan: Model OsceStase juga memiliki 'tanggal', 'jam_mulai', dll.
  // Form ini mungkin disederhanakan.
}
```

### 5\. Menampilkan Jadwal Sesi OSCE

  - **Endpoint**: `/admin/osce/{id}/jadwal`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar sesi jadwal per hari untuk OSCE (data dari `OsceStase`).
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_osce_stase": "integer", // Asumsi 1 baris = 1 sesi
    "tanggal": "date",
    "jam_mulai": "string",
    "jumlah_mahasiswa": "integer" // Data terkomputasi
  }
]
```

### 6\. Menambah Jadwal Sesi OSCE

  - **Endpoint**: `/admin/osce/{id}/jadwal`
  - **Method**: `POST`
  - **Deskripsi**: Membuat sesi jadwal ujian baru untuk OSCE (menyimpan ke model `OsceStase`).

**Request Body:**

```json
{
  "tanggal": "date"
  // Sesuai form image_810c09.png ('Jadwal mulai')
  // Kemungkinan perlu field lain dari OsceStase
}
```

### 7\. Menampilkan & Mengelola Enrollment Mahasiswa

  - **Endpoint**: `/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar mahasiswa (dari `Mahasiswa`) dan status enrollment (dari `EnrollmentOsce`).
  - **Query Parameters**:
      - `search`: `string`
      - `angkatan`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_mahasiswa": "integer",
    "nim": "string",
    "nama": "string",
    "is_enrolled": "boolean" // Data terkomputasi
  }
]
```

### 8\. Memperbarui Enrollment Mahasiswa

  - **Endpoint**: `/admin/osce/{osce_id}/jadwal/{jadwal_id}/enrollment`
  - **Method**: `POST` atau `PUT`
  - **Deskripsi**: Menyimpan perubahan enrollment (membuat/menghapus data `EnrollmentOsce`).

**Request Body:**

```json
{
  "id_mahasiswa_array": ["array", "of", "integer"]
}
```

-----

## Mahasiswa

### 1\. Menampilkan Semua Mahasiswa

  - **Endpoint**: `/admin/mahasiswa`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil semua data mahasiswa dari model `Mahasiswa`.
  - **Query Parameters**:
      - `search`: `string`
      - `angkatan`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_mahasiswa": "integer",
    "nim": "string",
    "nama": "string"
  }
]
```

### 2\. Menambah Mahasiswa Baru (via Form)

  - **Endpoint**: `/admin/mahasiswa`
  - **Method**: `POST`
  - **Deskripsi**: Menambah data `Pengguna` dan `Mahasiswa` baru.

**Request Body:**

```json
{
  "nim": "string",       // Untuk Mahasiswa.nim & Pengguna.username
  "nama": "string",      // Untuk Mahasiswa.nama
  "kelas": "string",     // Mapping dari 'Angkatan' di form
  "prodi": "string"      // Mapping dari 'Jurusan' di form
  // Email tidak ada di model. Password (Pengguna) dibuat otomatis.
}
```

### 3\. Menambah Mahasiswa Baru (via Excel)

  - **Endpoint**: `/admin/mahasiswa/import`
  - **Method**: `POST`
  - **Deskripsi**: Menambah data mahasiswa baru secara massal melalui unggah file Excel.
  - **Request Body**: `multipart/form-data` (berisi file Excel)

-----

## Penguji (Dosen)

### 1\. Menampilkan Semua Penguji

  - **Endpoint**: `/admin/dosen`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil semua data penguji dari model `Penguji`.
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_penguji": "integer",
    "nip": "string",
    "nama": "string"
  }
]
```

### 2\. Menambah Penguji Baru

  - **Endpoint**: `/admin/dosen`
  - **Method**: `POST`
  - **Deskripsi**: Menambah data `Pengguna` dan `Penguji` baru.

**Request Body:**

```json
{
  "nip": "string",       // Untuk Penguji.nip & Pengguna.username
  "nama": "string"       // Untuk Penguji.nama
  // Gelar tidak ada di model. Password (Pengguna) dibuat otomatis.
}
```

-----

## Stase

Bagian ini mengelola data master untuk Stase (template rubrik penilaian).

### 1\. Menampilkan Semua stase

  - **Endpoint**: `/stase`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil semua data dari model `Stase`.
  - **Query Parameters**:
      - `flash`: `string`

**Response Body (Contoh Array):**

```json
[
  {
    "id_stase": "integer",
    "nama_stase": "string",
    "jumlah_aspek": "integer" // Data terkomputasi
  }
]
```

### 2\. Menambah stase Baru

  - **Endpoint**: `/stase/tambah`
  - **Method**: `POST`
  - **Deskripsi**: Menambah data baru ke tabel `stase`.

**Request Body:**

```json
{
  "nama_stase": "string",
  "deskripsi": "string",
  "id_mata_kuliah": "integer"
  // 'id_tujuan_pembelajaran' juga ada di fillable
}
```

**Optional Query Parameter:**

  - `flash`: `string` (Untuk pesan notifikasi)

### 3\. Menampilkan aspek penilaian tiap stase

  - **Endpoint**: `/stase/{id}/aspek`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil data aspek dari `AspekPenilaian` berdasarkan `id_stase`.

**Response Body (Contoh Array):**

```json
[
  {
    "id_aspek_penilaian": "integer",
    "aspek": "string",
    "bobot_maksimum": "integer",
    "jumlah_kompetensi": "integer" // Data terkomputasi
  }
]
```

### 4\. Tambah aspek penilaian per stase

  - **Endpoint**: `/stase/{id}/aspek/{id}`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil data detail satu `AspekPenilaian`.

**Response Body (Contoh Objek):**

```json
{
  "id_aspek_penilaian": "integer",
  "aspek": "string",
  "bobot_maksimum": "integer"
}
```

-----

  - **Endpoint**: `/stase/{id}/aspek/{id}`
  - **Method**: `POST` atau `PUT`
  - **Deskripsi**: Mengubah data yang ada di tabel `aspek_penilaian`.

**Request Body:**

```json
{
  "aspek": "string",
  "bobot_maksimum": "integer"
}
```

-----

### 5\. Tambah Kompetensi per aspek

  - **Endpoint**: `/stase/{id}/aspek/{id}/kompetensi`
  - **Method**: `GET`
  - **Deskripsi**: Mengambil data dari `poin_aspek_penilaian`.

**Response Body (Contoh Array):**

```json
[
  {
    "id_poin_aspek_penilaian": "integer",
    "kompetensi": "string",
    "skor": "integer",
    "bobot": "integer"
  }
]
```

-----

  - **Endpoint**: `/stase/{id}/aspek/{id}/kompetensi`
  - **Method**: `POST` atau `PUT`
  - **Deskripsi**: Mengubah data di tabel `poin_aspek_penilaian`.

**Request Body:**

```json
{
  "kompetensi": "string",
  "skor": "integer",
  "bobot": "integer"
}
```
