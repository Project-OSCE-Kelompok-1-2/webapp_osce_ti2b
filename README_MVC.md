# 📖 Panduan Dokumentasi MVC - Projek OSCE

## 🎯 Tentang Dokumentasi Ini

Dokumentasi ini dibuat untuk menjelaskan **arsitektur MVC (Model-View-Controller)** pada projek **webapp_osce_ti2b** secara lengkap dan detail, khusus untuk keperluan **UAS (Ujian Akhir Semester)**.

---

## 📚 Daftar File Dokumentasi

### 1. **PENJELASAN_MVC.md** ⭐ (BACA INI DULU!)
**File utama** yang berisi penjelasan lengkap tentang:
- ✅ Pengenalan konsep MVC
- ✅ Penjelasan detail komponen Model (18 models)
- ✅ Penjelasan detail komponen View (41 React components + 4 Blade templates)
- ✅ Penjelasan detail komponen Controller (30+ controllers)
- ✅ Layer tambahan: Services, Middleware, Routes, Imports/Exports
- ✅ Contoh kode lengkap untuk setiap komponen
- ✅ Alur kerja MVC dengan contoh konkret (Admin mengelola mahasiswa)
- ✅ Struktur direktori lengkap projek
- ✅ Tabel perbandingan komponen MVC
- ✅ Rangkuman untuk UAS

**📍 Lokasi:** `/PENJELASAN_MVC.md`

---

### 2. **DIAGRAM_MVC_FLOW.md** 🎨 (UNTUK VISUALISASI!)
**File diagram visual** yang berisi:
- ✅ Diagram arsitektur lengkap MVC
- ✅ Diagram alur untuk 4 skenario CRUD:
  - 📖 READ: Melihat daftar mahasiswa
  - ➕ CREATE: Menambah mahasiswa baru
  - ✏️ UPDATE: Mengedit data mahasiswa
  - 🗑️ DELETE: Menghapus mahasiswa
- ✅ ERD (Entity Relationship Diagram) - relasi antar model
- ✅ Diagram arsitektur berlapis (Onion Architecture)
- ✅ Rangkuman poin penting untuk UAS

**📍 Lokasi:** `/DIAGRAM_MVC_FLOW.md`

---

## 🗺️ Cara Membaca Dokumentasi

### Untuk Pemula (Belum paham MVC):
```
1. Baca PENJELASAN_MVC.md dari awal sampai akhir
2. Pahami konsep dasar MVC (Model, View, Controller)
3. Lihat DIAGRAM_MVC_FLOW.md untuk visualisasi
4. Baca bagian "Alur Kerja MVC dengan Contoh"
5. Pelajari contoh kode yang diberikan
```

### Untuk yang Sudah Paham Dasar:
```
1. Langsung ke bagian "Struktur Direktori Lengkap" di PENJELASAN_MVC.md
2. Pelajari layer tambahan: Services, Middleware, Routes
3. Lihat diagram ERD di DIAGRAM_MVC_FLOW.md
4. Pahami alur CRUD di DIAGRAM_MVC_FLOW.md
5. Baca rangkuman untuk UAS
```

### Untuk Persiapan UAS (Cepat):
```
1. Baca "Rangkuman Poin Penting untuk UAS" di DIAGRAM_MVC_FLOW.md
2. Lihat tabel "Daftar Model", "Daftar View", "Daftar Controller" di PENJELASAN_MVC.md
3. Pahami diagram alur CRUD di DIAGRAM_MVC_FLOW.md
4. Hafalkan lokasi file komponen MVC
5. Pahami relasi antar model
```

---

## 🎓 Poin-Poin Penting untuk UAS

### 1. **Definisi MVC**
- **Model (M)**: Mengelola data dan berinteraksi dengan database
- **View (V)**: Menampilkan user interface kepada pengguna
- **Controller (C)**: Menghubungkan Model dan View, menangani request

### 2. **Lokasi File di Projek OSCE**
```
Model      → app/Models/                 (18 models)
View       → resources/js/pages/         (41 React components)
            resources/views/             (4 Blade templates)
Controller → app/Http/Controllers/       (30+ controllers)
Service    → app/Services/               (Business logic)
Routes     → routes/web.php, api.php     (URL mapping)
Middleware → app/Http/Middleware/        (Request filtering)
```

### 3. **Alur Request-Response**
```
User → Route → Middleware → Controller → Service → Model → Database
                                                              ↓
User ← View ← Inertia ← Controller ← Service ← Model ← Database
```

### 4. **CRUD Operations**
- **CREATE**: `store()` method → INSERT INTO database
- **READ**: `index()`, `show()` methods → SELECT FROM database
- **UPDATE**: `update()` method → UPDATE database
- **DELETE**: `destroy()` method → DELETE FROM database

### 5. **Contoh Model & Relasi**
```php
// Model Mahasiswa
class Mahasiswa extends Model {
    // Many-to-One: Satu mahasiswa punya satu pengguna
    public function pengguna() {
        return $this->belongsTo(Pengguna::class);
    }
    
    // One-to-Many: Satu mahasiswa punya banyak enrollment
    public function enrollment() {
        return $this->hasMany(Enrollment::class);
    }
}
```

### 6. **Contoh Controller**
```php
class MahasiswaController extends Controller {
    // READ: Tampilkan daftar
    public function index() {
        $mahasiswa = $this->service->getAll();
        return Inertia::render('Admin/MahasiswaPage', [
            'mahasiswa' => $mahasiswa
        ]);
    }
    
    // CREATE: Simpan data baru
    public function store(Request $request) {
        $validated = $request->validate([...]);
        $this->service->store($validated);
        return redirect()->route('admin.mahasiswa.index');
    }
}
```

### 7. **Contoh View (React)**
```jsx
const MahasiswaPage = () => {
    const { mahasiswa } = usePage().props;
    
    return (
        <table>
            {mahasiswa.map(mhs => (
                <tr key={mhs.id}>
                    <td>{mhs.nim}</td>
                    <td>{mhs.nama}</td>
                </tr>
            ))}
        </table>
    );
};
```

---

## 📊 Statistik Projek OSCE

| Komponen | Jumlah | Lokasi |
|----------|--------|--------|
| **Models** | 18 | `app/Models/` |
| **React Views** | 41 | `resources/js/pages/` |
| **Blade Views** | 4 | `resources/views/` |
| **Controllers** | 30+ | `app/Http/Controllers/` |
| **Services** | 15+ | `app/Services/` |
| **Middleware** | 5 | `app/Http/Middleware/` |
| **Routes** | 3 | `routes/` |

---

## 🔗 Teknologi yang Digunakan

### Backend:
- **Laravel** - PHP Framework dengan pola MVC
- **Eloquent ORM** - Object-Relational Mapping untuk database
- **MySQL** - Database management system

### Frontend:
- **React.js** - Library JavaScript untuk UI
- **Inertia.js** - Menghubungkan Laravel dengan React (SPA-like)
- **Tailwind CSS** - Utility-first CSS framework

### Tools:
- **Composer** - PHP dependency manager
- **NPM** - Node package manager
- **Vite** - Frontend build tool

---

## 📝 Daftar Model (18 Models)

1. **Mahasiswa** - Data mahasiswa
2. **Penguji** - Data dosen penguji
3. **Admin** - Data administrator
4. **Osce** - Data ujian OSCE
5. **Stase** - Data station ujian
6. **AspekPenilaian** - Aspek yang dinilai
7. **NilaiOsce** - Nilai mahasiswa
8. **Enrollment** - Pendaftaran mahasiswa
9. **EnrollmentOsce** - Pendaftaran ke OSCE
10. **Pengguna** - User sistem
11. **TahunAkademik** - Tahun akademik
12. **MataKuliah** - Mata kuliah
13. **Blok** - Blok pembelajaran
14. **Ruang** - Ruang ujian
15. **OsceStase** - Relasi OSCE-Stase
16. **PoinAspekPenilaian** - Poin penilaian
17. **TujuanPembelajaran** - Learning objectives
18. **LogoInstitusi** - Logo institusi

---

## 🎯 Kesimpulan

Projek **webapp_osce_ti2b** menggunakan arsitektur **MVC** dengan layer tambahan untuk memisahkan tanggung jawab:

```
┌──────────────┐
│     View     │ ← React.js + Inertia.js (UI)
├──────────────┤
│  Controller  │ ← Request handler & orchestration
├──────────────┤
│   Service    │ ← Business logic (Layer tambahan!)
├──────────────┤
│    Model     │ ← Data & database interaction
├──────────────┤
│   Database   │ ← MySQL
└──────────────┘
```

**Keuntungan:**
- ✅ Kode terorganisir dan mudah dipahami
- ✅ Mudah maintenance dan testing
- ✅ Separation of concerns
- ✅ Reusable dan scalable

---

## 📞 Bantuan

Jika ada pertanyaan tentang dokumentasi ini, silakan:
1. Baca ulang bagian yang tidak dipahami
2. Lihat contoh kode yang diberikan
3. Pahami diagram visualnya
4. Tanyakan ke dosen/asisten

---

**Selamat belajar dan semoga sukses UAS! 🎓✨**

---

*Dokumentasi ini dibuat dengan ❤️ untuk mahasiswa TI-2B*
*Last updated: 2026-01-04*
