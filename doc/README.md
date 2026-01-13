# Dokumentasi MOSAIC OSCE

Selamat datang di dokumentasi lengkap aplikasi **MOSAIC** (Management of Objective Structured Clinical Examination).

## 📑 Daftar Dokumentasi

### 1. [Proses Bisnis dan Interoperabilitas](PROSES_BISNIS_DAN_INTEROPERABILITAS.md)

Dokumen ini menjelaskan secara mendalam tentang:

- **Tentang Aplikasi MOSAIC OSCE**
  - Teknologi yang digunakan (Laravel 11, React 19, Laravel Sanctum)
  - Arsitektur aplikasi

- **Konsep Interoperabilitas**
  - Definisi dan implementasi interoperabilitas
  - Arsitektur layer API (dari client hingga database)
  - Keuntungan implementasi interoperabilitas

- **Proses Bisnis Lengkap**
  - Aktor dalam sistem (Admin, Penguji, Mahasiswa)
  - Alur manajemen data master
  - Alur konfigurasi ujian OSCE
  - Proses pelaksanaan ujian
  - Monitoring dan rekapitulasi nilai
  - Akses nilai oleh mahasiswa

- **Skenario Interoperabilitas**
  - Integrasi dengan Sistem Informasi Akademik (SIAKAD)
  - Aplikasi mobile untuk penguji
  - Dashboard analytics untuk manajemen
  - Portal mahasiswa terintegrasi

- **Keamanan dan Autentikasi**
  - Laravel Sanctum Bearer Token
  - Role-based authorization
  - Data validation

**Target Pembaca:** Manager, Stakeholder, Developer yang ingin memahami bisnis proses dan konsep interoperabilitas

---

### 2. [Daftar URL API](DAFTAR_URL_API.md)

Dokumen referensi lengkap untuk semua endpoint API:

- **Informasi Umum**
  - Base URL dan versi API
  - Cara menggunakan API
  - Format autentikasi

- **Daftar Lengkap 64 Endpoint**
  - Tabel komprehensif (NO, URL, METHOD, PARAMETER, DESKRIPSI)
  - Endpoint dikelompokkan berdasarkan modul:
    - Autentikasi (3 endpoints)
    - Admin Module (45 endpoints)
    - Penguji Module (10 endpoints)
    - Mahasiswa Module (6 endpoints)

- **Detail Parameter per Endpoint**
  - Request body schema
  - Response format dan contoh
  - Query parameters
  - Success dan error responses

- **HTTP Status Codes**
- **Rate Limiting**
- **Pagination**
- **Testing dengan cURL, Postman, dan Interactive Docs**

**Target Pembaca:** Developer, QA Engineer, API Consumer

---

### 3. [Dokumentasi Teknis API](DOKUMENTASI_TEKNIS_API.md)

Panduan teknis implementasi dan integrasi API:

- **Arsitektur API**
  - Layer architecture detail
  - Folder structure
  - Request/response flow

- **Autentikasi dan Keamanan**
  - Laravel Sanctum token authentication (dengan diagram flow)
  - Login, authenticated request, dan logout
  - Role-based authorization (admin, penguji, mahasiswa)
  - Security headers
  - Rate limiting

- **Request & Response Format**
  - Content-Type dan Accept headers
  - GET, POST, PUT, DELETE examples
  - Multipart/form-data untuk file upload
  - Success response structure
  - Paginated collection response

- **Error Handling**
  - HTTP status codes detail
  - Validation error (422)
  - Authentication error (401)
  - Authorization error (403)
  - Not found error (404)
  - Server error (500)

- **Contoh Integrasi Lengkap**
  - **PHP**: Integrasi dengan Sistem Akademik (dengan kode lengkap)
  - **JavaScript/React Native**: Mobile app untuk penguji
  - **Python**: Dashboard analytics

- **Best Practices**
  - Token management
  - Error handling patterns
  - Request optimization
  - Data validation
  - Timeout dan retry logic

- **Troubleshooting**
  - Common issues dan solusinya
  - CORS errors
  - Authentication problems
  - Debugging tips

**Target Pembaca:** Developer yang akan mengintegrasikan sistem dengan API MOSAIC OSCE

---

### 4. [Props Contract](props_contract.md)

Dokumentasi kontrak props untuk frontend (Inertia.js):

- Endpoint untuk web interface
- Props structure untuk setiap halaman
- Data flow antara backend dan frontend

**Target Pembaca:** Frontend Developer

---

## 🚀 Quick Start

### Untuk Developer yang Ingin Menggunakan API

1. **Baca:** [Daftar URL API](DAFTAR_URL_API.md) untuk melihat endpoint yang tersedia
2. **Pelajari:** [Dokumentasi Teknis API](DOKUMENTASI_TEKNIS_API.md) untuk implementasi detail
3. **Praktek:** Akses interactive documentation di `http://localhost/docs/api`

### Untuk Stakeholder/Manager

1. **Baca:** [Proses Bisnis dan Interoperabilitas](PROSES_BISNIS_DAN_INTEROPERABILITAS.md)
2. **Pahami:** Bagaimana sistem dapat diintegrasikan dengan sistem lain
3. **Diskusikan:** Skenario integrasi yang sesuai dengan kebutuhan organisasi

---

## 📊 Ringkasan API

### Statistik API

- **Total Endpoints:** 64
- **Authentication Method:** Laravel Sanctum (Bearer Token)
- **Data Format:** JSON
- **API Version:** v1
- **OpenAPI Spec:** 3.1.0

### Breakdown Endpoints

| Modul | Jumlah Endpoint | Deskripsi |
|-------|-----------------|-----------|
| Autentikasi | 3 | Login, logout, get current user |
| Admin | 45 | Manajemen data master, OSCE, jadwal, enrollment, rekap |
| Penguji | 10 | Profil, penilaian real-time, edit & view nilai |
| Mahasiswa | 6 | Dashboard, nilai, jadwal, profil |

### Fitur Utama API

✅ **CRUD Lengkap** untuk semua entitas (Mahasiswa, Penguji, Stase, OSCE, dll)  
✅ **Token-based Authentication** dengan Laravel Sanctum  
✅ **Role-based Authorization** (admin, penguji, mahasiswa)  
✅ **Pagination** untuk list endpoints  
✅ **File Upload** (Excel import, image upload)  
✅ **Search & Filtering**  
✅ **Validation** dengan error messages detail  
✅ **Rate Limiting** untuk mencegah abuse  
✅ **Auto-generated OpenAPI Documentation**  

---

## 🔗 Link Penting

- **Interactive API Docs:** `/docs/api`
- **OpenAPI Spec (JSON):** `/api.json`
- **Repository:** [GitHub - MOSAIC OSCE](https://github.com/Project-OSCE-Kelompok-1-2/webapp_osce_ti2b)

---

## 📞 Support

Untuk pertanyaan atau bantuan terkait API dan integrasi:

1. Buka issue di [GitHub Issues](https://github.com/Project-OSCE-Kelompok-1-2/webapp_osce_ti2b/issues)
2. Hubungi tim development
3. Lihat [Troubleshooting Guide](DOKUMENTASI_TEKNIS_API.md#troubleshooting)

---

## 📝 Changelog

### Version 1.0 (Current - Januari 2025)

**Dokumentasi:**
- ✅ Proses bisnis dan interoperabilitas lengkap
- ✅ Daftar URL API dengan 64 endpoints
- ✅ Dokumentasi teknis dengan contoh kode
- ✅ Contoh integrasi untuk PHP, JavaScript, dan Python

**API Features:**
- ✅ RESTful API dengan 64 endpoints
- ✅ Laravel Sanctum authentication
- ✅ Role-based authorization
- ✅ OpenAPI 3.1 specification
- ✅ Interactive documentation

---

**Last Updated:** Januari 2025

**MOSAIC** © 2025 - Management of Objective Structured Clinical Examination
