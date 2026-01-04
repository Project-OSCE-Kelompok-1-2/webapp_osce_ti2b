# DIAGRAM ALUR KERJA MVC - PROJEK OSCE

## 🎯 Diagram Arsitektur Lengkap

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE (Browser)                       │
│                    Mahasiswa / Penguji / Admin Login                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         HTTP REQUEST                                     │
│              GET /admin/mahasiswa?search=john                            │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        ROUTES (routes/web.php)                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Route::middleware(['auth', 'role:admin'])                       │   │
│   │     ->get('/admin/mahasiswa', [MahasiswaController@index])     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     MIDDLEWARE (Filter Layer)                            │
│   ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│   │ GuestMiddleware  │  │ RoleMiddleware   │  │ HandleInertia       │  │
│   │ ❌ Cek belum    │  │ ✅ Cek role:    │  │ Requests            │  │
│   │    login         │  │    admin         │  │                     │  │
│   └──────────────────┘  └──────────────────┘  └─────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ (Jika lolos semua middleware)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               CONTROLLER (app/Http/Controllers/Admin/)                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ MahasiswaController.php                                         │   │
│   │                                                                 │   │
│   │ public function index(Request $request)                        │   │
│   │ {                                                              │   │
│   │     $search = $request->input('search');                       │   │
│   │     $angkatan = $request->input('angkatan');                  │   │
│   │                                                                │   │
│   │     // Panggil SERVICE untuk logika bisnis                    │   │
│   │     $mahasiswa = $this->service->getAll($search, $angkatan);  │   │
│   │                                                                │   │
│   │     // Kirim data ke VIEW                                     │   │
│   │     return Inertia::render('Admin/MahasiswaPage', [           │   │
│   │         'mahasiswa' => $mahasiswa                             │   │
│   │     ]);                                                        │   │
│   │ }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                SERVICE LAYER (app/Services/Admin/)                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ MahasiswaService.php                                            │   │
│   │                                                                 │   │
│   │ public function getAll($search, $angkatan)                     │   │
│   │ {                                                              │   │
│   │     // Query builder dengan filter                            │   │
│   │     $query = Mahasiswa::query()                               │   │
│   │         ->with(['enrollment.tahunAkademik']);                 │   │
│   │                                                                │   │
│   │     // Filter search                                          │   │
│   │     $query->when($search, function($q) use ($search) {        │   │
│   │         $q->where('nim', 'like', "%{$search}%")              │   │
│   │           ->orWhere('nama', 'like', "%{$search}%");          │   │
│   │     });                                                        │   │
│   │                                                                │   │
│   │     return $query->orderBy('nama')->get();                    │   │
│   │ }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      MODEL (app/Models/)                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Mahasiswa.php (Eloquent ORM)                                    │   │
│   │                                                                 │   │
│   │ class Mahasiswa extends Model                                  │   │
│   │ {                                                              │   │
│   │     protected $table = 'mahasiswa';                           │   │
│   │     protected $fillable = ['nama', 'nim', 'kelas', 'prodi'];  │   │
│   │                                                                │   │
│   │     // RELASI                                                  │   │
│   │     public function enrollment() {                            │   │
│   │         return $this->hasMany(Enrollment::class);             │   │
│   │     }                                                          │   │
│   │                                                                │   │
│   │     public function pengguna() {                              │   │
│   │         return $this->belongsTo(Pengguna::class);             │   │
│   │     }                                                          │   │
│   │ }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ (Execute SQL Query)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MySQL)                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ SELECT mahasiswa.*, enrollment.*, tahun_akademik.*             │   │
│   │ FROM mahasiswa                                                  │   │
│   │ LEFT JOIN enrollment ON mahasiswa.id = enrollment.id_mahasiswa │   │
│   │ LEFT JOIN tahun_akademik ON enrollment.id_tahun = ...          │   │
│   │ WHERE mahasiswa.nim LIKE '%john%'                              │   │
│   │    OR mahasiswa.nama LIKE '%john%'                             │   │
│   │ ORDER BY mahasiswa.nama ASC                                    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   Tables: mahasiswa, enrollment, pengguna, osce, nilai_osce, etc.       │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ (Return Result Set)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODEL → SERVICE → CONTROLLER                          │
│                   (Data mengalir kembali ke atas)                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    INERTIA.JS (Bridge Layer)                             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Converts Laravel data to React props                            │   │
│   │ {                                                               │   │
│   │   "mahasiswa": [                                               │   │
│   │     {"id": 1, "nim": "12345", "nama": "John Doe", ...},       │   │
│   │     {"id": 2, "nim": "67890", "nama": "Jane Smith", ...}      │   │
│   │   ]                                                            │   │
│   │ }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 VIEW - React Component (resources/js/pages/)             │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Admin/MahasiswaPage.jsx                                         │   │
│   │                                                                 │   │
│   │ import { usePage } from '@inertiajs/react';                    │   │
│   │                                                                 │   │
│   │ const MahasiswaPage = () => {                                  │   │
│   │   const { mahasiswa } = usePage().props;                       │   │
│   │                                                                 │   │
│   │   return (                                                     │   │
│   │     <div className="container">                               │   │
│   │       <h1>Daftar Mahasiswa</h1>                               │   │
│   │       <table>                                                  │   │
│   │         <thead>                                                │   │
│   │           <tr>                                                 │   │
│   │             <th>NIM</th>                                       │   │
│   │             <th>Nama</th>                                      │   │
│   │             <th>Kelas</th>                                     │   │
│   │             <th>Aksi</th>                                      │   │
│   │           </tr>                                                │   │
│   │         </thead>                                               │   │
│   │         <tbody>                                                │   │
│   │           {mahasiswa.map(mhs => (                             │   │
│   │             <tr key={mhs.id}>                                 │   │
│   │               <td>{mhs.nim}</td>                              │   │
│   │               <td>{mhs.nama}</td>                             │   │
│   │               <td>{mhs.kelas}</td>                            │   │
│   │               <td>                                            │   │
│   │                 <button>Edit</button>                         │   │
│   │                 <button>Hapus</button>                        │   │
│   │               </td>                                           │   │
│   │             </tr>                                             │   │
│   │           ))}                                                 │   │
│   │         </tbody>                                              │   │
│   │       </table>                                                │   │
│   │     </div>                                                    │   │
│   │   );                                                          │   │
│   │ }                                                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      HTML RESPONSE (Rendered)                            │
│                                                                          │
│   <!DOCTYPE html>                                                        │
│   <html>                                                                 │
│     <body>                                                               │
│       <div id="app">                                                     │
│         <h1>Daftar Mahasiswa</h1>                                        │
│         <table>                                                          │
│           <tr>                                                           │
│             <td>12345</td><td>John Doe</td><td>TI-2B</td>               │
│             <td><button>Edit</button> <button>Hapus</button></td>       │
│           </tr>                                                          │
│           ...                                                            │
│         </table>                                                         │
│       </div>                                                             │
│     </body>                                                              │
│   </html>                                                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER SEES THE PAGE                                │
│                   (Halaman daftar mahasiswa ditampilkan)                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Diagram Interaksi User dengan Sistem

### Skenario 1: User Melihat Daftar Mahasiswa (READ)

```
┌──────────┐
│  USER    │ Buka halaman /admin/mahasiswa
│ (Admin)  │────────────────────────────────────┐
└──────────┘                                    │
                                                ▼
                                        ┌───────────────┐
                                        │   ROUTES      │
                                        │   web.php     │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  MIDDLEWARE   │
                                        │  auth, role   │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │  CONTROLLER   │
                                        │  index()      │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │   SERVICE     │
                                        │   getAll()    │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │    MODEL      │
                                        │  Mahasiswa    │
                                        └───────┬───────┘
                                                │
                                                ▼
                                        ┌───────────────┐
                                        │   DATABASE    │
                                        │   SELECT *    │
                                        └───────┬───────┘
                                                │
                            ┌───────────────────┴───────────────────┐
                            │ Data kembali melalui jalur yang sama  │
                            └───────────────────┬───────────────────┘
                                                ▼
┌──────────┐                            ┌───────────────┐
│  USER    │ ◄──────────────────────────│     VIEW      │
│ (Admin)  │  Melihat tabel mahasiswa   │ MahasiswaPage │
└──────────┘                            └───────────────┘
```

### Skenario 2: User Menambah Mahasiswa Baru (CREATE)

```
┌──────────┐
│  USER    │ 1. Klik "Tambah Mahasiswa"
│ (Admin)  │──────────────────────────────┐
└──────────┘                              │
                                          ▼
                                  ┌───────────────┐
                                  │  CONTROLLER   │
                                  │  create()     │ Tampilkan form kosong
                                  └───────┬───────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │     VIEW      │
                                  │ TambahMhs.jsx │ Form input
                                  └───────┬───────┘
                                          │
┌──────────┐                              │
│  USER    │ 2. Isi form & klik "Simpan" │
│ (Admin)  │◄─────────────────────────────┘
└────┬─────┘
     │ 3. POST /admin/mahasiswa/store
     │    data: {nim, nama, kelas, prodi}
     ▼
┌────────────┐
│ CONTROLLER │
│  store()   │ Validasi input
└─────┬──────┘
      │ $request->validate([...])
      ▼
┌────────────┐
│  SERVICE   │
│  store()   │ Transaction: Buat Pengguna + Mahasiswa
└─────┬──────┘
      │
      ▼
┌────────────┐
│   MODEL    │
│ Pengguna   │ INSERT INTO pengguna
│ Mahasiswa  │ INSERT INTO mahasiswa
└─────┬──────┘
      │
      ▼
┌────────────┐
│  DATABASE  │ Data tersimpan
└─────┬──────┘
      │
      │ 4. Redirect ke /admin/mahasiswa
      ▼
┌──────────┐
│  USER    │ Melihat mahasiswa baru di list
│ (Admin)  │
└──────────┘
```

### Skenario 3: User Mengedit Mahasiswa (UPDATE)

```
┌──────────┐
│  USER    │ 1. Klik tombol "Edit" pada row mahasiswa
│ (Admin)  │──────────────────────────────────────────┐
└──────────┘                                          │
                                                      ▼
                                              ┌───────────────┐
                                              │  CONTROLLER   │
                                              │  edit($id)    │
                                              └───────┬───────┘
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │    MODEL      │
                                              │ find($id)     │ SELECT * WHERE id=$id
                                              └───────┬───────┘
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │     VIEW      │
                                              │ TambahMhs.jsx │ Form terisi data lama
                                              └───────┬───────┘
                                                      │
┌──────────┐                                          │
│  USER    │ 2. Edit data & klik "Update"            │
│ (Admin)  │◄─────────────────────────────────────────┘
└────┬─────┘
     │ 3. PUT/PATCH /admin/mahasiswa/{id}
     │    data: {nim, nama, kelas, prodi}
     ▼
┌────────────┐
│ CONTROLLER │
│ update()   │ Validasi input
└─────┬──────┘
      │
      ▼
┌────────────┐
│  SERVICE   │
│ update()   │ Transaction: Update Mahasiswa + Pengguna
└─────┬──────┘
      │
      ▼
┌────────────┐
│   MODEL    │
│ Mahasiswa  │ UPDATE mahasiswa SET ... WHERE id=$id
└─────┬──────┘
      │
      ▼
┌────────────┐
│  DATABASE  │ Data terupdate
└─────┬──────┘
      │
      │ 4. Redirect ke /admin/mahasiswa
      ▼
┌──────────┐
│  USER    │ Melihat data mahasiswa yang sudah diupdate
│ (Admin)  │
└──────────┘
```

### Skenario 4: User Menghapus Mahasiswa (DELETE)

```
┌──────────┐
│  USER    │ 1. Klik tombol "Hapus"
│ (Admin)  │──────────────────────────┐
└──────────┘                          │
                                      ▼
                              ┌───────────────┐
                              │     VIEW      │
                              │ Konfirmasi    │ "Yakin hapus?"
                              └───────┬───────┘
                                      │
┌──────────┐                          │
│  USER    │ 2. Klik "Ya, Hapus"     │
│ (Admin)  │◄─────────────────────────┘
└────┬─────┘
     │ 3. DELETE /admin/mahasiswa/{id}
     ▼
┌────────────┐
│ CONTROLLER │
│ destroy()  │
└─────┬──────┘
      │
      ▼
┌────────────┐
│  SERVICE   │
│  delete()  │ Transaction: Hapus Mahasiswa + Pengguna
└─────┬──────┘
      │
      ▼
┌────────────┐
│   MODEL    │
│ Mahasiswa  │ DELETE FROM mahasiswa WHERE id=$id
│ Pengguna   │ DELETE FROM pengguna WHERE id=$id_pengguna
└─────┬──────┘
      │
      ▼
┌────────────┐
│  DATABASE  │ Data terhapus
└─────┬──────┘
      │
      │ 4. Redirect ke /admin/mahasiswa
      ▼
┌──────────┐
│  USER    │ Mahasiswa sudah tidak ada di list
│ (Admin)  │
└──────────┘
```

---

## 🏗️ Diagram Relasi Antar Model (ERD Simplified)

```
┌──────────────┐
│  Pengguna    │
│─────────────│
│ id_pengguna  │◄───────┐
│ username     │        │
│ password     │        │ belongsTo
│ jenis_role   │        │
└──────────────┘        │
                        │
        ┌───────────────┴────────────────┬─────────────────┐
        │                                │                 │
        │                                │                 │
┌───────▼──────┐              ┌──────────▼──────┐  ┌──────▼──────┐
│  Mahasiswa   │              │     Penguji     │  │    Admin    │
│──────────────│              │─────────────────│  │─────────────│
│id_mahasiswa  │              │ id_penguji      │  │ id_admin    │
│id_pengguna   │              │ id_pengguna     │  │ id_pengguna │
│nama          │              │ nama            │  │ nama        │
│nim           │              │ nip             │  │             │
│kelas         │              │                 │  │             │
│prodi         │              │                 │  │             │
└───────┬──────┘              └─────────┬───────┘  └─────────────┘
        │                               │
        │ hasMany                       │ hasMany
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────────┐
│ Enrollment   │              │   NilaiOsce      │
│──────────────│              │──────────────────│
│id_enrollment │              │ id_nilai         │
│id_mahasiswa  │──┐           │ id_enrollment    │
│id_tahun_aka..│  │           │ id_penguji       │
└──────────────┘  │           │ id_aspek_penilaian│
                  │           │ nilai            │
                  │           └──────────────────┘
                  │
                  │ hasMany
                  ▼
        ┌──────────────────┐
        │ EnrollmentOsce   │
        │──────────────────│
        │ id_enrollment_os │
        │ id_mahasiswa     │
        │ id_osce          │───────┐
        │ id_sesi          │       │
        └──────────────────┘       │
                                   │ belongsTo
                                   ▼
                          ┌─────────────┐
                          │    Osce     │
                          │─────────────│
                          │ id_osce     │
                          │ judul       │
                          │ tanggal     │
                          │ durasi      │
                          │ id_matakuliah│
                          └──────┬──────┘
                                 │
                                 │ hasMany (through OsceStase)
                                 ▼
                          ┌─────────────┐
                          │   Stase     │
                          │─────────────│
                          │ id_stase    │
                          │ nama_stase  │
                          │ deskripsi   │
                          └─────────────┘
```

---

## 📦 Diagram Layer Aplikasi (Onion Architecture)

```
┌───────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                     │
│                      (User Interface)                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              VIEW - React Components                     │  │
│  │  • Admin/MahasiswaPage.jsx                              │  │
│  │  • Penguji/PengujiDashboard.jsx                         │  │
│  │  • Mahasiswa/DashboardMahasiswa.jsx                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                      ROUTING & MIDDLEWARE LAYER                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Routes (web.php, api.php)                              │  │
│  │  Middleware (auth, role, guest)                         │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                       CONTROLLER LAYER                         │
│                   (Request Handler)                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │       Admin/MahasiswaController.php                      │  │
│  │       Penguji/AksiPenilaianController.php               │  │
│  │       Mahasiswa/NilaiMahasiswaController.php            │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                            │
│                    (Business Logic)                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │       Admin/MahasiswaService.php                         │  │
│  │       Penguji/AksiPenilaianService.php                  │  │
│  │       Mahasiswa/NilaiMahasiswaService.php               │  │
│  │                                                          │  │
│  │  • Validasi kompleks                                    │  │
│  │  • Transaction management                               │  │
│  │  • Business rules                                       │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                        MODEL LAYER                             │
│                  (Data Access Layer)                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │   Models (Eloquent ORM)                                  │  │
│  │   • Mahasiswa.php                                        │  │
│  │   • Penguji.php                                          │  │
│  │   • Osce.php                                             │  │
│  │   • NilaiOsce.php                                        │  │
│  │                                                          │  │
│  │  • Relasi antar tabel                                   │  │
│  │  • Attribute casting                                    │  │
│  │  • Accessors & Mutators                                 │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                           │
│                         (MySQL)                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Tables: mahasiswa, penguji, osce, nilai_osce,          │  │
│  │          enrollment, stase, aspek_penilaian, dll        │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## 🎯 Rangkuman Poin Penting untuk UAS

### 1. **Definisi MVC**
- **M**odel: Mengelola data & database
- **V**iew: Tampilan untuk user
- **C**ontroller: Penghubung Model & View

### 2. **Lokasi File di Projek OSCE**
- Model: `app/Models/` (18 models)
- View: `resources/js/pages/` (41 React components)
- Controller: `app/Http/Controllers/` (30+ controllers)

### 3. **Alur Request-Response**
```
User → Route → Middleware → Controller → Service → Model → Database
                                                              ↓
User ← View ← Inertia ← Controller ← Service ← Model ← Database
```

### 4. **Layer Tambahan**
- **Service**: Logika bisnis (di `app/Services/`)
- **Middleware**: Filter request (di `app/Http/Middleware/`)
- **Routes**: Mapping URL ke Controller (di `routes/`)

### 5. **CRUD Operations**
- **C**reate: `store()` method
- **R**ead: `index()`, `show()` methods
- **U**pdate: `update()` method
- **D**elete: `destroy()` method

### 6. **Keuntungan MVC**
- ✅ Separation of Concerns
- ✅ Mudah maintenance
- ✅ Reusable code
- ✅ Parallel development
- ✅ Testable

---

**Dokumen ini dibuat untuk membantu pemahaman arsitektur MVC pada projek OSCE**

*Semoga sukses UAS! 📚✨*
