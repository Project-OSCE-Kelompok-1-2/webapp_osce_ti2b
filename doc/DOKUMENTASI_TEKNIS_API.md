# Dokumentasi Teknis API - MOSAIC OSCE

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Arsitektur API](#arsitektur-api)
3. [Autentikasi dan Keamanan](#autentikasi-dan-keamanan)
4. [Request & Response Format](#request--response-format)
5. [Error Handling](#error-handling)
6. [Contoh Integrasi](#contoh-integrasi)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Pendahuluan

### Tentang API

MOSAIC OSCE API adalah RESTful API yang dibangun menggunakan Laravel 11 untuk mengelola sistem ujian OSCE (Objective Structured Clinical Examination). API ini dirancang dengan prinsip interoperabilitas untuk memungkinkan integrasi dengan berbagai sistem eksternal.

### Teknologi

- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum (Token-based)
- **Database**: MySQL 8.0+
- **API Standard**: RESTful dengan JSON
- **Documentation**: OpenAPI 3.1 (via Scramble)

### Base URL

```
Development: http://localhost/api/v1
Production: https://your-domain.com/api/v1
```

### Versi API

Current Version: **v1**

---

## Arsitektur API

### Layer Architecture

```
┌─────────────────────────────────────────┐
│         HTTP Client (Consumer)          │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│          API Routes (routes/api.php)    │
│  - Route definition                     │
│  - Middleware assignment                │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│          Middleware Layer               │
│  - auth:sanctum (Authentication)        │
│  - roleApi:admin|penguji|mahasiswa      │
│  - throttle (Rate limiting)             │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│     API Controllers                     │
│  - Request validation                   │
│  - Business logic delegation            │
│  - Response formatting                  │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  - Business logic implementation        │
│  - Data transformation                  │
│  - Complex queries                      │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│         Models (Eloquent ORM)           │
│  - Database interaction                 │
│  - Relationships                        │
│  - Accessors/Mutators                   │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│            MySQL Database               │
└─────────────────────────────────────────┘
```

### Folder Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── V1/
│   │           ├── AuthController.php
│   │           ├── Admin/
│   │           │   ├── MahasiswaController.php
│   │           │   ├── OsceController.php
│   │           │   └── ...
│   │           ├── Penguji/
│   │           │   ├── AksiPenilaianApiController.php
│   │           │   └── ...
│   │           └── Mahasiswa/
│   │               ├── DashboardMahasiswaController.php
│   │               └── ...
│   └── Middleware/
│       ├── RoleApiMiddleware.php
│       └── ...
├── Services/
│   ├── Admin/
│   │   ├── MahasiswaService.php
│   │   ├── OsceService.php
│   │   └── ...
│   └── Penguji/
│       └── NilaiOsceService.php
└── Models/
    ├── Mahasiswa.php
    ├── Osce.php
    ├── NilaiOsce.php
    └── ...
```

---

## Autentikasi dan Keamanan

### Laravel Sanctum Token Authentication

MOSAIC OSCE menggunakan **Laravel Sanctum** untuk autentikasi API berbasis token.

#### Flow Autentikasi

```
┌──────────┐                          ┌──────────┐
│  Client  │                          │  Server  │
└────┬─────┘                          └────┬─────┘
     │                                     │
     │  POST /api/v1/login                 │
     │  {username, password}               │
     ├────────────────────────────────────>│
     │                                     │
     │                                     │ Validate credentials
     │                                     │ Generate token
     │                                     │
     │  200 OK                             │
     │  {token: "1|abc123...", user: {}}   │
     │<────────────────────────────────────┤
     │                                     │
     │  Store token in memory/localStorage │
     │                                     │
     │                                     │
     │  GET /api/v1/admin/dashboard        │
     │  Authorization: Bearer 1|abc123...  │
     ├────────────────────────────────────>│
     │                                     │
     │                                     │ Verify token
     │                                     │ Check user permissions
     │                                     │
     │  200 OK                             │
     │  {data: {...}}                      │
     │<────────────────────────────────────┤
     │                                     │
```

#### 1. Login Request

**Endpoint**: `POST /api/v1/login`

**Request:**
```http
POST /api/v1/login HTTP/1.1
Host: localhost
Content-Type: application/json

{
    "username": "admin",
    "password": "password123"
}
```

**Success Response:**
```json
{
    "message": "Login berhasil",
    "user": {
        "id_pengguna": 1,
        "username": "admin",
        "role": "admin"
    },
    "token": "1|qazxswedcvfrtgbnhyujmkiolp"
}
```

**Error Response (401):**
```json
{
    "message": "Username atau password salah"
}
```

#### 2. Authenticated Request

Setelah mendapat token, sertakan token di **Authorization Header** untuk setiap request:

```http
GET /api/v1/admin/dashboard HTTP/1.1
Host: localhost
Authorization: Bearer 1|qazxswedcvfrtgbnhyujmkiolp
Accept: application/json
```

#### 3. Logout Request

**Endpoint**: `POST /api/v1/logout`

```http
POST /api/v1/logout HTTP/1.1
Host: localhost
Authorization: Bearer 1|qazxswedcvfrtgbnhyujmkiolp
```

**Success Response:**
```json
{
    "message": "Berhasil logout"
}
```

Token akan di-revoke dan tidak dapat digunakan lagi.

---

### Role-Based Authorization

API menerapkan **role-based access control (RBAC)** menggunakan middleware `roleApi`.

#### Tipe Role

1. **admin** - Akses penuh ke semua endpoint admin
2. **penguji** - Akses ke endpoint penilaian dan profil penguji
3. **mahasiswa** - Akses ke endpoint jadwal, nilai, dan profil mahasiswa

#### Implementasi Middleware

```php
// routes/api.php

// Admin routes - hanya admin yang bisa akses
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'roleApi:admin'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::apiResource('mahasiswa', MahasiswaController::class);
        // ...
    });

// Penguji routes - hanya penguji yang bisa akses
Route::prefix('penguji')
    ->middleware(['auth:sanctum', 'roleApi:penguji'])
    ->group(function () {
        Route::post('/penilaian/{id}', [AksiPenilaianController::class, 'store']);
        // ...
    });
```

**Unauthorized Access Response (403):**
```json
{
    "message": "Forbidden. You don't have permission to access this resource."
}
```

---

### Security Headers

Semua API response menyertakan security headers:

```http
Content-Type: application/json
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

### Rate Limiting

API menerapkan rate limiting untuk mencegah abuse:

- **Limit**: 60 requests per minute per user
- **Throttle Key**: User ID atau IP Address

**Response Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
```

**Exceeded Limit Response (429):**
```json
{
    "message": "Too Many Requests"
}
```

---

## Request & Response Format

### Content-Type

Semua request dan response menggunakan **JSON**:

```http
Content-Type: application/json
Accept: application/json
```

### Request Structure

#### GET Request with Query Parameters

```http
GET /api/v1/admin/mahasiswa?search=john&angkatan=2021&page=1 HTTP/1.1
Host: localhost
Authorization: Bearer {token}
Accept: application/json
```

#### POST Request with JSON Body

```http
POST /api/v1/admin/mahasiswa HTTP/1.1
Host: localhost
Authorization: Bearer {token}
Content-Type: application/json

{
    "nim": "2021001",
    "nama": "John Doe",
    "kelas": "TI-2A",
    "prodi": "Teknik Informatika"
}
```

#### PUT/PATCH Request

```http
PUT /api/v1/admin/mahasiswa/1 HTTP/1.1
Host: localhost
Authorization: Bearer {token}
Content-Type: application/json

{
    "nim": "2021001",
    "nama": "John Doe Updated",
    "kelas": "TI-2B",
    "prodi": "Teknik Informatika"
}
```

#### DELETE Request

```http
DELETE /api/v1/admin/mahasiswa/1 HTTP/1.1
Host: localhost
Authorization: Bearer {token}
```

#### Multipart/Form-Data (File Upload)

```http
POST /api/v1/admin/mahasiswa/import HTTP/1.1
Host: localhost
Authorization: Bearer {token}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="mahasiswa.xlsx"
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

[binary data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

---

### Response Structure

#### Success Response

**Structure:**
```json
{
    "status": "success",
    "message": "Optional success message",
    "data": {
        // Actual data
    }
}
```

**Example - Single Resource:**
```json
{
    "status": "success",
    "data": {
        "id_mahasiswa": 1,
        "nim": "2021001",
        "nama": "John Doe",
        "kelas": "TI-2A",
        "prodi": "Teknik Informatika"
    }
}
```

**Example - Collection (Paginated):**
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id_mahasiswa": 1,
                "nim": "2021001",
                "nama": "John Doe"
            },
            {
                "id_mahasiswa": 2,
                "nim": "2021002",
                "nama": "Jane Smith"
            }
        ],
        "first_page_url": "http://localhost/api/v1/admin/mahasiswa?page=1",
        "from": 1,
        "last_page": 10,
        "last_page_url": "http://localhost/api/v1/admin/mahasiswa?page=10",
        "links": [...],
        "next_page_url": "http://localhost/api/v1/admin/mahasiswa?page=2",
        "path": "http://localhost/api/v1/admin/mahasiswa",
        "per_page": 15,
        "prev_page_url": null,
        "to": 15,
        "total": 150
    },
    "filters": {
        "search": null,
        "angkatan": "2021"
    }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 204 | No Content | Request berhasil tanpa response body (DELETE) |
| 400 | Bad Request | Request tidak valid |
| 401 | Unauthorized | Token tidak valid atau tidak ada |
| 403 | Forbidden | Tidak memiliki permission |
| 404 | Not Found | Resource tidak ditemukan |
| 422 | Unprocessable Entity | Validasi gagal |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Error di server |

---

### Validation Error (422)

**Response:**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "nim": [
            "NIM sudah terdaftar"
        ],
        "nama": [
            "Nama harus diisi"
        ],
        "kelas": [
            "Kelas harus diisi"
        ]
    }
}
```

**Field-specific errors:**
- Key: field name
- Value: array of error messages

---

### Authentication Error (401)

**Missing Token:**
```json
{
    "message": "Unauthenticated"
}
```

**Invalid Credentials:**
```json
{
    "message": "Username atau password salah"
}
```

---

### Authorization Error (403)

```json
{
    "message": "Forbidden. You don't have permission to access this resource."
}
```

---

### Not Found Error (404)

**Model Not Found:**
```json
{
    "message": "Data tidak ditemukan"
}
```

**Custom Error:**
```json
{
    "status": "error",
    "message": "Data Mahasiswa tidak ditemukan."
}
```

---

### Server Error (500)

```json
{
    "status": "error",
    "message": "Terjadi kesalahan server. Silakan coba lagi nanti."
}
```

---

## Contoh Integrasi

### 1. Integrasi dengan Sistem Akademik (PHP)

**Scenario:** Auto-enrollment mahasiswa dari SIAKAD ke OSCE

```php
<?php

class OsceApiClient
{
    private $baseUrl = 'http://localhost/api/v1';
    private $token;

    public function __construct()
    {
        $this->login();
    }

    private function login()
    {
        $response = $this->makeRequest('POST', '/login', [
            'username' => 'admin',
            'password' => 'password123'
        ]);

        $this->token = $response['token'];
    }

    public function enrollStudents($osceId, $jadwalId, $studentIds)
    {
        return $this->makeRequest(
            'POST',
            "/admin/osce/{$osceId}/jadwal/{$jadwalId}/enrollment",
            ['id_mahasiswa_array' => $studentIds]
        );
    }

    private function makeRequest($method, $endpoint, $data = [])
    {
        $ch = curl_init();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        if ($this->token) {
            $headers[] = "Authorization: Bearer {$this->token}";
        }

        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => $method,
        ]);

        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode >= 400) {
            throw new Exception($result['message'] ?? 'API Error');
        }

        return $result;
    }
}

// Usage
$api = new OsceApiClient();

try {
    $result = $api->enrollStudents(
        osceId: 1,
        jadwalId: 5,
        studentIds: [101, 102, 103, 104, 105]
    );

    echo "Enrollment berhasil: " . $result['message'];
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

---

### 2. Mobile App untuk Penguji (JavaScript/React Native)

```javascript
// api/osceApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired, redirect to login
            AsyncStorage.removeItem('auth_token');
            // Navigate to login screen
        }
        return Promise.reject(error);
    }
);

// API Methods
export const osceApi = {
    // Login
    login: async (username, password) => {
        const response = await api.post('/login', { username, password });
        await AsyncStorage.setItem('auth_token', response.data.token);
        return response.data;
    },

    // Get antrian mahasiswa
    getAntrian: async (osceId, staseId) => {
        const response = await api.get(`/osce/${osceId}/stase/${staseId}`);
        return response.data;
    },

    // Get rubrik penilaian
    getRubrik: async (enrollmentId) => {
        const response = await api.get(`/penilaian/${enrollmentId}`);
        return response.data;
    },

    // Submit penilaian
    submitNilai: async (enrollmentId, nilai, feedback) => {
        const response = await api.post(`/penguji/penilaian/${enrollmentId}`, {
            nilai,
            feedback,
        });
        return response.data;
    },

    // Logout
    logout: async () => {
        await api.post('/logout');
        await AsyncStorage.removeItem('auth_token');
    },
};

// Usage in Component
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { osceApi } from './api/osceApi';

const PenilaianScreen = ({ osceId, staseId }) => {
    const [antrian, setAntrian] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAntrian();
    }, []);

    const loadAntrian = async () => {
        try {
            const data = await osceApi.getAntrian(osceId, staseId);
            setAntrian(data.data.antrian_mahasiswa);
        } catch (error) {
            console.error('Error loading antrian:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNilai = async (enrollmentId) => {
        // Navigate to penilaian form
    };

    return (
        <View>
            <Text>Antrian Mahasiswa</Text>
            <FlatList
                data={antrian}
                keyExtractor={(item) => item.id_enrollment_osce.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.nama} - {item.nim}</Text>
                        <Text>Status: {item.status_penilaian}</Text>
                        <Button
                            title="Nilai"
                            onPress={() => handleNilai(item.id_enrollment_osce)}
                        />
                    </View>
                )}
            />
        </View>
    );
};
```

---

### 3. Dashboard Analytics (Python)

```python
import requests
import pandas as pd
from typing import Dict, List

class MosaicOsceAPI:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def login(self, username: str, password: str) -> Dict:
        """Login and get authentication token"""
        response = self.session.post(
            f'{self.base_url}/login',
            json={'username': username, 'password': password}
        )
        response.raise_for_status()
        data = response.json()
        self.token = data['token']
        self.session.headers.update({
            'Authorization': f'Bearer {self.token}'
        })
        return data

    def get_rekap_nilai(self, osce_id: int, sesi_id: int) -> List[Dict]:
        """Get rekap nilai per sesi"""
        response = self.session.get(
            f'{self.base_url}/admin/rekap-nilai/{osce_id}/sesi/{sesi_id}/mahasiswa'
        )
        response.raise_for_status()
        return response.json()['data']['mahasiswa_list']

    def get_all_osce(self) -> List[Dict]:
        """Get all OSCE data"""
        response = self.session.get(f'{self.base_url}/admin/osce')
        response.raise_for_status()
        return response.json()['data']

# Usage for analytics
api = MosaicOsceAPI('http://localhost/api/v1')
api.login('admin', 'password123')

# Get all OSCE
osce_list = api.get_all_osce()

# Get nilai data
nilai_data = []
for osce in osce_list:
    # Assuming we know the sesi IDs
    data = api.get_rekap_nilai(osce['id_osce'], sesi_id=1)
    nilai_data.extend(data)

# Convert to DataFrame for analysis
df = pd.DataFrame(nilai_data)

# Analytics
print("Statistik Nilai OSCE:")
print(df['nilai_total'].describe())
print("\nPersentase Kelulusan:")
print(df['status_lulus'].value_counts(normalize=True) * 100)

# Export to CSV
df.to_csv('osce_analytics.csv', index=False)
```

---

## Best Practices

### 1. Token Management

**DO:**
- ✅ Store token securely (HttpOnly cookie, secure storage)
- ✅ Implement token refresh mechanism
- ✅ Clear token on logout
- ✅ Handle token expiration gracefully

**DON'T:**
- ❌ Store token in localStorage (web) - vulnerable to XSS
- ❌ Log token in console
- ❌ Share token between users

---

### 2. Error Handling

**DO:**
```javascript
try {
    const response = await api.get('/admin/mahasiswa');
    // Handle success
} catch (error) {
    if (error.response) {
        // Server responded with error status
        if (error.response.status === 422) {
            // Handle validation errors
            const errors = error.response.data.errors;
            // Show field-specific errors to user
        } else if (error.response.status === 401) {
            // Handle authentication error
            // Redirect to login
        } else {
            // Handle other errors
            console.error(error.response.data.message);
        }
    } else if (error.request) {
        // Request made but no response
        console.error('Network error');
    } else {
        // Something else happened
        console.error('Error:', error.message);
    }
}
```

---

### 3. Request Optimization

**Pagination:**
```javascript
// Request with pagination
const response = await api.get('/admin/mahasiswa', {
    params: {
        page: 1,
        per_page: 50, // Adjust based on needs
        search: 'john',
        angkatan: '2021'
    }
});
```

**Filtering:**
```javascript
// Use query parameters for filtering
const response = await api.get('/admin/rekap-nilai', {
    params: {
        tahun: '2024/2025',
        search: 'Radiologi'
    }
});
```

---

### 4. Data Validation

**Client-side validation BEFORE sending:**
```javascript
const validateMahasiswa = (data) => {
    const errors = {};

    if (!data.nim || data.nim.length > 20) {
        errors.nim = 'NIM harus diisi dan maksimal 20 karakter';
    }

    if (!data.nama || data.nama.length > 255) {
        errors.nama = 'Nama harus diisi dan maksimal 255 karakter';
    }

    return Object.keys(errors).length === 0 ? null : errors;
};

// Usage
const data = { nim: '2021001', nama: 'John Doe', ... };
const errors = validateMahasiswa(data);

if (!errors) {
    // Send to API
    await api.post('/admin/mahasiswa', data);
} else {
    // Show errors to user
    console.error(errors);
}
```

---

### 5. Request Timeout & Retry

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/api/v1',
    timeout: 30000, // 30 seconds
});

// Retry logic
const axiosRetry = async (fn, retriesLeft = 3, interval = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retriesLeft === 0) throw error;

        // Retry only on network errors or 5xx
        if (!error.response || error.response.status >= 500) {
            await new Promise(resolve => setTimeout(resolve, interval));
            return axiosRetry(fn, retriesLeft - 1, interval * 2);
        }

        throw error;
    }
};

// Usage
const data = await axiosRetry(() => api.get('/admin/dashboard'));
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Error

**Problem:**
```
Access to XMLHttpRequest at 'http://localhost/api/v1/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Configure CORS in Laravel (`config/cors.php`):
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

#### 2. 401 Unauthorized

**Problem:** Request returns 401 even with token

**Checklist:**
- ✅ Token format: `Bearer {token}` (with space)
- ✅ Token not expired
- ✅ Token in `Authorization` header (not `Authentication`)
- ✅ Middleware `auth:sanctum` applied to route

**Debug:**
```bash
# Check if token exists in database
php artisan tinker
>>> \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', '1|plaintext-token'))->first();
```

---

#### 3. 422 Validation Error

**Problem:** Unexpected validation errors

**Debug:**
```php
// In controller, log validation errors
try {
    $validated = $request->validate([...]);
} catch (\Illuminate\Validation\ValidationException $e) {
    \Log::error('Validation failed', [
        'errors' => $e->errors(),
        'input' => $request->all()
    ]);
    throw $e;
}
```

---

#### 4. 500 Internal Server Error

**Problem:** Server returning 500 with no details

**Debug:**
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Enable debug mode (ONLY in development!)
# .env
APP_DEBUG=true
```

---

#### 5. Rate Limit Exceeded

**Problem:** 429 Too Many Requests

**Solution:**
- Implement exponential backoff
- Cache responses when possible
- Batch requests instead of multiple individual calls

```javascript
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withRateLimit = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.response?.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000; // Exponential backoff
                await sleep(delay);
                continue;
            }
            throw error;
        }
    }
};
```

---

## Support & Documentation

### OpenAPI Documentation

Access interactive API documentation:
```
http://localhost/docs/api
```

### Additional Resources

- **OpenAPI Spec**: `/api.json`
- **Source Code**: [GitHub Repository]
- **Issue Tracker**: [GitHub Issues]

---

## Changelog

### Version 1.0 (Current)

**Features:**
- ✅ Complete CRUD operations for all entities
- ✅ Token-based authentication via Laravel Sanctum
- ✅ Role-based authorization
- ✅ Pagination support
- ✅ File upload (Excel import, image upload)
- ✅ OpenAPI 3.1 documentation
- ✅ Rate limiting

**Endpoints:** 64 endpoints total
- Authentication: 3
- Admin: 45
- Penguji: 10
- Mahasiswa: 6

---

**Last Updated:** January 2025
