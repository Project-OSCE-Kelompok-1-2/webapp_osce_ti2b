# OSCE Web Application

A comprehensive web application for managing **Objective Structured Clinical Examination (OSCE)** assessments. This system facilitates the organization, scheduling, grading, and reporting of OSCE examinations for educational institutions.

## Features

### For Administrators
- **Dashboard** - Overview of OSCE activities and statistics
- **OSCE Management** - Create, edit, and manage OSCE examinations
- **Schedule Management** - Configure exam sessions, rooms, and time slots
- **Student Management** - Add, edit, import (via Excel), and manage student records
- **Examiner Management** - Manage examiner/lecturer information
- **Stase & Assessment Criteria** - Define clinical stations (stases) and their assessment components
- **Competency Management** - Configure learning objectives and competency points
- **Enrollment** - Assign students to specific OSCE sessions
- **Grade Recapitulation** - View and export student grades (PDF/Excel)

### For Examiners (Penguji)
- **Live Grading** - Real-time assessment interface for evaluating students
- **Queue Management** - View and manage student rotation queues
- **Grade Review & Edit** - Review and modify submitted grades
- **Grade Export** - Export assessment results to PDF or Excel
- **Profile Management** - Update account settings

### For Students (Mahasiswa)
- **Dashboard** - Personal OSCE overview
- **Schedule View** - View assigned OSCE examination schedules
- **Grade Viewing** - Access assessment results and detailed feedback
- **Profile Management** - Update personal account settings

## Technology Stack

### Backend
- **PHP 8.2+** with **Laravel 11** framework
- **Laravel Sanctum** for API authentication
- **Maatwebsite Excel** for Excel import/export
- **Laravel DomPDF** for PDF generation
- **Scramble** for API documentation

### Frontend
- **React 19** with **Inertia.js** for SPA-like experience
- **Vite** for asset bundling
- **Tailwind CSS 3** for styling
- **Lucide React** for icons
- **Ziggy** for Laravel route handling in JavaScript

### Database
- SQLite (default) or any Laravel-supported database

## Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Project-OSCE-Kelompok-1-2/webapp_osce_ti2b.git
   cd webapp_osce_ti2b
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   # Create SQLite database (default)
   touch database/database.sqlite
   
   # Run migrations
   php artisan migrate
   
   # (Optional) Seed with sample data
   php artisan db:seed
   ```

6. **Build frontend assets**
   ```bash
   npm run build
   ```

## Development

Run the development server with all services:

```bash
composer dev
```

This command starts:
- Laravel development server
- Queue listener
- Log viewer (Pail)
- Vite development server

Alternatively, run services individually:

```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev
```

## Testing

```bash
# Run all tests
php artisan test

# Or using PHPUnit directly
vendor/bin/phpunit
```

## API Documentation

The application includes a REST API with authentication via Laravel Sanctum. API documentation is auto-generated using Scramble.

### API Endpoints Overview

| Prefix | Description |
|--------|-------------|
| `/api/v1/admin/*` | Admin management endpoints |
| `/api/v1/penguji/*` | Examiner assessment endpoints |
| `/api/v1/mahasiswa/*` | Student portal endpoints |

## Project Structure

```
├── app/
│   ├── Http/Controllers/     # Web & API controllers
│   │   ├── Admin/            # Admin controllers
│   │   ├── Penguji/          # Examiner controllers
│   │   ├── Mahasiswa/        # Student controllers
│   │   └── Api/              # API controllers
│   ├── Models/               # Eloquent models
│   ├── Services/             # Business logic services
│   └── Imports/              # Excel import handlers
├── database/
│   ├── migrations/           # Database schema
│   ├── seeders/              # Sample data
│   └── factories/            # Model factories
├── resources/
│   └── js/
│       ├── components/       # React components
│       └── pages/            # Inertia page components
├── routes/
│   ├── web.php               # Web routes
│   └── api.php               # API routes
└── tests/                    # Feature & unit tests
```

## Key Models

| Model | Description |
|-------|-------------|
| `Osce` | OSCE examination event |
| `Stase` | Clinical station/rotation |
| `Mahasiswa` | Student records |
| `Penguji` | Examiner/lecturer records |
| `AspekPenilaian` | Assessment criteria |
| `NilaiOsce` | Student grades |
| `EnrollmentOsce` | Student-OSCE assignments |
| `OsceStase` | OSCE session schedules |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

---

**Project OSCE (Kelompok 1-2)** © 2025
