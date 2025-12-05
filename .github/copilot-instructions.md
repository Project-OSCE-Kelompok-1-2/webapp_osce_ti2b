# Copilot Instructions for webapp_osce_ti2b

## Project Overview
- This is a Laravel-based web application for OSCE (Objective Structured Clinical Examination) management, using PHP for backend logic and Blade for views.
- The codebase follows Laravel conventions for routing, controllers, models, and services, but introduces custom service classes for business logic.

## Key Architectural Patterns
- **Controllers** (`app/Http/Controllers/`): Handle HTTP requests, delegate business logic to services.
- **Services** (`app/Services/`): Encapsulate business logic. Each major entity (e.g., Mahasiswa, Osce, Penguji) has a corresponding service class. Use these for non-trivial logic instead of placing it in controllers or models.
- **Models** (`app/Models/`): Represent database tables using Eloquent ORM. Relationships and attribute casting are defined here.
- **Imports** (`app/Imports/`): For batch data import, e.g., MahasiswaImport.
- **Routes** (`routes/`):
  - `web.php`: Web routes (Blade views, browser-based UI)
  - `api.php`: API endpoints (JSON responses)
  - `console.php`: Artisan CLI commands
- **Migrations/Seeders/Factories** (`database/`): For schema, test data, and seeding.

## Developer Workflows
- **Install dependencies:**
  - PHP: `composer install`
  - JS/CSS: `npm install`
- **Build frontend assets:** `npm run build` (uses Vite and Tailwind CSS)
- **Run development server:** `php artisan serve`
- **Run tests:** `php artisan test` or `vendor\bin\phpunit`
- **Database migrations:** `php artisan migrate` (see `database/migrations/`)
- **Seed database:** `php artisan db:seed`

## Project-Specific Conventions
- **Service Layer:** Always add new business logic in a Service class under `app/Services/` and call from controllers.
- **Eloquent Models:** Use relationships and accessors/mutators for data logic. Avoid putting business logic in models.
- **Imports:** Use `app/Imports/` for batch data operations (e.g., Excel import).
- **Testing:** Place feature and unit tests under `tests/Feature/` and `tests/Unit/`.
- **Configuration:** All config in `config/` directory. Sensitive data via `.env` (not committed).

## Integration Points
- **External Packages:**
  - Laravel core packages (see `composer.json`)
  - `maatwebsite/excel` for import/export
  - `inertiajs/inertia-laravel` for SPA-like features
  - Tailwind CSS for styling (see `tailwind.config.js`)
- **Frontend:** Uses Vite for asset bundling, Tailwind for CSS, and Inertia.js for SPA features.

## Examples
- To add a new entity (e.g., "Ruang"):
  1. Create a model in `app/Models/Ruang.php`
  2. Create a migration in `database/migrations/`
  3. Add a service in `app/Services/RuangService.php`
  4. Add a controller in `app/Http/Controllers/`
  5. Register routes in `routes/web.php` or `routes/api.php`

- To import Mahasiswa data: Use `app/Imports/MahasiswaImport.php` with `maatwebsite/excel`.

## References
- See `README.md` for general Laravel info.
- Key directories: `app/`, `routes/`, `database/`, `resources/`, `config/`.

---

If you are unsure about a pattern, check for similar examples in the `app/Services/` and `app/Http/Controllers/` directories.
