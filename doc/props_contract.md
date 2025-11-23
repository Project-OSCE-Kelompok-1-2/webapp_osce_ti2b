

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

  - **Endpoint**: `/admin/osce/{id_osce}/stase`
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

  - **Endpoint**: `/admin/osce/{id_osce}/stase`
  - **Method**: `POST`
  - **Deskripsi**: Menambahkan dan mengkonfigurasi stase baru untuk OSCE (menyimpan ke model `OsceStase`).

**Request Body:**

```json
{
  "id_ruang": "integer",
  "id_stase": "integer",
  "id_penguji": "integer"
  // Catatan: Model OsceStase juga memiliki 'tanggal', 'jam_mulai', dll.
}
```

### 5\. Menampilkan Jadwal Sesi OSCE

  - **Endpoint**: `/admin/osce/{id_osce}/jadwal`
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

  - **Endpoint**: `/admin/osce/{id_osce}/jadwal`
  - **Method**: `POST`
  - **Deskripsi**: Membuat sesi jadwal ujian baru untuk OSCE (menyimpan ke model `OsceStase`).

**Request Body:**

```json
{
  "tanggal": "date"
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

## Rekap Nilai

Bagian ini mengelola alur untuk melihat rekapitulasi nilai OSCE yang telah selesai.

### 1\. Menampilkan Daftar OSCE (Rekap)

  - **Endpoint**: `/admin/rekap-nilai`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar OSCE yang sudah/sedang berjalan untuk rekapitulasi nilai.
  - **Query Parameters**:
      - `search`: `string`
      - `tahun`: `string`

**Response Body (Contoh Array):** (Uses `Osce` model)

```json
[
  {
    "id_osce": "integer",
    "nama_rubrik": "string", // Alias for nama_osce
    "rentang_tanggal": "string",
    "tahun_akademik": "string", // From relation
    "detail_mahasiswa": "string", // Computed
    "detail_sesi": "string" // Computed
  }
]
```

### 2\. Menampilkan Daftar Sesi per OSCE (Rekap)

  - **Endpoint**: `/admin/rekap-nilai/{id_osce}/sesi`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar sesi (berdasarkan tanggal) untuk OSCE tertentu. 
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Contoh Array):** (Uses `OsceStase` model, grouped)

```json
[
  {
    "id_sesi": "string", // Unique identifier for the session (e.g., date)
    "tanggal_sesi": "string",
    "jumlah_mahasiswa": "integer" // Computed
  }
]
```

### 3\. Menampilkan Daftar Mahasiswa per Sesi (Rekap)

  - **Endpoint**: `/admin/rekap-nilai/{id_osce}/sesi/{id_sesi}/mahasiswa`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar mahasiswa yang terdaftar pada sesi tertentu. 
  - **Query Parameters**:
      - `search`: `string`
      - `angkatan`: `string` (from dropdown)

**Response Body (Contoh Array):** (Uses `EnrollmentOsce` + `Mahasiswa`)

```json
[
  {
    "id_mahasiswa": "integer",
    "nim": "string",
    "nama": "string"
  }
]
```

### 4\. Menampilkan Nilai Detail Mahasiswa per Stase

  - **Endpoint**: `/admin/rekap-nilai/mahasiswa/{id_mahasiswa}/osce/{id_osce}`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan rincian nilai per stase untuk seorang mahasiswa dalam OSCE tertentu. (Sesuai deskripsi user).

**Response Body (Contoh Objek):** (Uses `NilaiOsce` and relations)

```json
{
  "mahasiswa": {
    "nama": "string",
    "nim": "string"
  },
  "osce": {
    "nama_osce": "string"
  },
  "nilai_per_stase": [
    {
      "nama_stase": "string",
      "nilai_akhir_stase": "decimal",
      "aspek_penilaian": [
        {
          "aspek": "string",
          "nilai": "decimal",
          "kompetensi": [
            {
              "kompetensi": "string",
              "nilai": "decimal"
            }
          ]
        }
      ]
    }
  ],
  "nilai_total_osce": "decimal"
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

  - **Endpoint**: `/stase/{id_stase}/aspek`
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

  - **Endpoint**: `/stase/{id_stase}/aspek/{id_aspek}`
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

  - **Endpoint**: `/stase/{id_stase}/aspek/{id_aspek}`
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

  - **Endpoint**: `/stase/{id_stase}/aspek/{id_aspek}/kompetensi`
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

  - **Endpoint**: `/stase/{id_sease}/aspek/{id_aspek}/kompetensi`
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



## Penguji (Dosen)

Endpoint ini memiliki *prefix* (contoh: `/penguji`) dan hanya bisa diakses oleh pengguna dengan *role* 'penguji'.

### 1\. Dasbor Penguji

  - **Endpoint**: `/penguji/dashboard`
  - **Method**: `GET`
  - **Deskripsi**: Halaman utama Penguji setelah login.

**Response Body (Props):**

```json
{
  "nama_penguji": "string",
  "statistik": {
    "osce_mendatang": "integer",
    "osce_edit_nilai": "integer",
    "osce_selesai": "integer"
  },
  "jadwal_penting": [
    {
      "id_osce": "integer",
      "id_osce_stase": "integer",
      "nama_osce": "string",
      "status": "string"
    }
  ],
  "jadwal_7_hari": [
    {
      "id_osce": "integer",
      "tanggal": "date",
      "nama_osce": "string",
      "status": "string"
    }
  ]
}
```

-----

### 2\. Pengaturan Akun Penguji

  - **Endpoint**: `/penguji/profil`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan halaman pengaturan akun untuk Penguji.

**Response Body (Props):**

```json
{
  "profil": {
    "nama": "string",
    "nip": "string",
    "username": "string",
    "path_gambar": "string | null"
  }
}
```

-----

  - **Endpoint**: `/penguji/profil/password`
  - **Method**: `PUT`
  - **Deskripsi**: Memperbarui password penguji.

**Request Body:**

```json
{
  "password_lama": "string",
  "password_baru": "string",
  "konfirmasi_password_baru": "string"
}
```

-----

  - **Endpoint**: `/penguji/profil/gambar`
  - **Method**: `POST`
  - **Deskripsi**: Memperbarui gambar profil.
  - **Request Body**: `multipart/form-data`

-----

### 3\. Daftar OSCE Penguji

  - **Endpoint**: `/penguji/osce`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar semua OSCE yang ditugaskan kepada penguji.
  - **Query Parameters**:
      - `search`: `string`
      - `tahun`: `string`

**Response Body (Props):**

```json
{
  "osce_list": [
    {
      "id_osce": "integer",
      "id_osce_stase": "integer",
      "nama_osce": "string",
      "tanggal_mulai": "datetime",
      "tanggal_akhir": "datetime",
      "status": "string"
    }
  ],
  "filters": {
    "search": "string | null",
    "tahun": "string | null"
  }
}
```

-----

### 4\. Alur Penilaian OSCE (Live)

#### a. Detail Stase & Antrian Mahasiswa

  - **Endpoint**: `/penguji/osce/{id_osce}/stase/{id_osce_stase}`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan detail stase dan daftar (antrian) mahasiswa yang akan dinilai.

**Response Body (Props):**

```json
{
  "osce_detail": {
    "nama_osce": "string",
    "nama_stase": "string",
    "durasi_per_mahasiswa": "integer",
    "total_mahasiswa": "integer"
  },
  "antrian_mahasiswa": [
    {
      "id_mahasiswa": "integer",
      "id_enrollment_osce": "integer",
      "nim": "string",
      "nama": "string",
      "status_penilaian": "string"
    }
  ]
}
```

#### b. Memulai Penilaian (Menampilkan Rubrik)

  - **Endpoint**: `/penguji/penilaian/{id_enrollment_osce}`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan form rubrik penilaian untuk 1 mahasiswa.

**Response Body (Props):**

```json
{
  "mahasiswa": {
    "nama": "string",
    "nim": "string",
    "prodi": "string"
  },
  "rubrik": [
    {
      "aspek": "string",
      "kompetensi": [
        {
          "id_poin_aspek_penilaian": "integer",
          "deskripsi": "string",
          "bobot": "integer"
        }
      ]
    }
  ],
  "sisa_waktu_detik": "integer"
}
```

#### c. Menyimpan Nilai (Submit Penilaian)

  - **Endpoint**: `/penguji/penilaian/{id_enrollment_osce}`
  - **Method**: `POST`
  - **Deskripsi**: Menerima data dari form rubrik.

**Request Body:**

```json
{
  "feedback": "string | null",
  "nilai": [
    { 
      "id_poin_aspek_penilaian": "integer", 
      "skor": "integer" 
    }
  ]
}
```

#### d. Halaman Rotasi (Mahasiswa Selanjutnya)

  - **Endpoint**: `/penguji/osce/{id_osce}/stase/{id_osce_stase}/rotasi`
  - **Method**: `GET`
  - **Deskripsi**: Halaman "tunggu" yang menampilkan siapa mahasiswa selanjutnya.

**Response Body (Props):**

```json
{
  "mahasiswa_selanjutnya": {
    "id_enrollment_osce": "integer",
    "nama": "string",
    "nim": "string",
    "prodi": "string"
  } | null,
  "sisa_waktu_rotasi_detik": "integer"
}
```

#### e. Menyelesaikan Sesi Penilaian

  - **Endpoint**: `/penguji/osce/{id_osce}/stase/{id_osce_stase}/selesai`
  - **Method**: `POST`
  - **Deskripsi**: Mengunci sesi penilaian stase ini.

-----

### 5\. Alur Edit Nilai

#### a. Menampilkan Form Edit Nilai

  - **Endpoint**: `/penguji/penilaian/{id_enrollment_osce}/edit`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan rubrik yang sudah terisi untuk diedit (tanpa *timer*).

**Response Body (Props):**

```json
{
  "mahasiswa": {
    "nama": "string",
    "nim": "string"
  },
  "rubrik_terisi": [
    {
      "aspek": "string",
      "kompetensi": [
        {
          "id_poin_aspek_penilaian": "integer",
          "deskripsi": "string",
          "bobot": "integer",
          "skor": "integer"
        }
      ]
    }
  ],
  "feedback_tersimpan": "string | null"
}
```

#### b. Menyimpan Perubahan Nilai

  - **Endpoint**: `/penguji/penilaian/{id_enrollment_osce}`
  - **Method**: `PUT`
  - **Deskripsi**: Menerima data dari form *edit* dan memperbarui nilai.

**Request Body:**

```json
{
  "feedback": "string | null",
  "nilai": [
    {
      "id_poin_aspek_penilaian": "integer",
      "skor": "integer"
    }
  ]
}
```

-----

### 6\. Alur Rekap & Edit Nilai (Pasca-Ujian)

#### a. Daftar Mahasiswa (Mode Edit Nilai)

  - **Endpoint**: `/penguji/osce/{id_osce}/stase/{id_osce_stase}/edit-nilai`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar mahasiswa dalam satu sesi untuk *edit* nilai massal.
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Props):**

```json
{
  "osce_detail": {
    "nama_osce": "string",
    "nama_stase": "string",
    "waktu_per_rubrik": "string",
    "total_mahasiswa": "integer",
    "nama_penguji": "string"
  },
  "mahasiswa_list": [
    {
      "id_enrollment_osce": "integer",
      "nim": "string",
      "nama": "string",
      "nilai_total": "integer | null"
    }
  ]
}
```

#### b. Daftar Mahasiswa (Mode Rekap Nilai)

  - **Endpoint**: `/penguji/osce/{id_osce}/stase/{id_osce_stase}/rekap`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan daftar nilai akhir mahasiswa dalam satu sesi (mode *read-only*).
  - **Query Parameters**:
      - `search`: `string`

**Response Body (Props):**

```json
{
  "osce_detail": {
    "nama_osce": "string",
    "nama_stase": "string",
    "waktu_per_rubrik": "string",
    "total_mahasiswa": "integer",
    "nama_penguji": "string"
  },
  "mahasiswa_list": [
    {
      "id_enrollment_osce": "integer",
      "nim": "string",
      "nama": "string",
      "nilai_total": "integer | null"
    }
  ]
}
```

#### c. Melihat Detail Penilaian (Read-Only)

  - **Endpoint**: `/penguji/penilaian/{id_enrollment_osce}/view`
  - **Method**: `GET`
  - **Deskripsi**: Menampilkan rubrik *read-only* dari nilai yang sudah di-submit (sama dengan yang dilihat mahasiswa).

**Response Body (Props):**

```json
{
  "mahasiswa": {
    "nama": "string",
    "nim": "string",
    "jurusan": "string"
  },
  "rubrik_terisi": [
    {
      "aspek": "string",
      "kompetensi": [
        {
          "id_poin_aspek_penilaian": "integer",
          "deskripsi": "string",
          "skor": "integer",
          "bobot": "integer",
          "nilai_kompetensi": "integer"
        }
      ]
    }
  ],
  "total_nilai_aspek": "integer",
  "feedback": "string | null"
}
```
