<p align="center"><a href="#" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="OSCE System Logo"></a></p>

<p align="center">
<a href="#"><img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=flat&logo=laravel" alt="Laravel Version"></a>
<a href="#"><img src="https://img.shields.io/badge/Inertia.js-1.0-8f7ae4?style=flat&logo=inertia" alt="Inertia Version"></a>
<a href="#"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" alt="React Version"></a>
<a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status"></a>
<a href="#"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
</p>

## About OSCE Management System

The **OSCE (Objective Structured Clinical Examination) Management System** is a robust web application designed to streamline the clinical examination process for medical students. Built with the power of **Laravel**, **Inertia.js**, and **React**, this system provides a seamless experience for Administrators, Examiners (Penguji), and Students (Mahasiswa).

We strictly follow a **Service Layer Architecture** to ensure our logic is reusable between the Web Monolith and future API/Mobile integrations. Key features include:

- **Role-Based Access Control:** Dedicated portals for Admins, Examiners, and Students.
- **Real-Time Assessment:** Live grading interface for Examiners with instant score calculation.
- **Comprehensive Management:** Complete control over Stase, Rubrics, Competencies, and Scheduling.
- **Hybrid Architecture:** Monolithic Inertia.js frontend combined with a dedicated RESTful API for external consumption.
- **Secure & Scalable:** Built with IDOR protection and optimized database queries.

## Tech Stack & Architecture

This project leverages a modern stack to ensure performance and maintainability:

- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React.js via Inertia.js
- **Database:** MySQL
- **Styling:** Tailwind CSS
- **API:** Laravel Sanctum & Service Repository Pattern

## Installation & Setup

To get started with the OSCE Management System on your local machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/username/osce-project.git](https://github.com/username/osce-project.git)
   cd webapp_osce

2.  **Install Dependencies**

    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup**
    Copy the `.env.example` file to `.env` and configure your database credentials.

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4.  **Database Migration & Seeding**

    ```bash
    php artisan migrate --seed
    ```

5.  **Run the Application**
    You need to run both the PHP server and the Vite development server.

    ```bash
    php artisan serve
    npm run dev
    ```

## Project Team

We would like to extend our thanks to the incredible team working on this project!

### Management & QA

  - **Ray** 

### Backend & Database Team

  - **Ifad** 
  - **Ilham** 
  - **Asdif** 
  - **Pandu** 
  - **Septia** 
  - **Najwa** 
  - **Afkar** 
  - **Bintang** 

### Frontend Team

  - **Khansa** 
  - **Zian** 
  - **Sendy** 
  - **Hafizh** 

### UI/UX Team

  - **Riko**
  - **Levina**
  - **Maria**
  - **Nadja** 

## API Documentation

This project provides a set of JSON APIs for external integration (Mobile Apps).

  - **Base URL:** `/api/v1`
  - **Authentication:** Bearer Token (Sanctum)
  - **Documentation:** Check the `Props Contract` document or the Postman Collection provided by the API Team.


## Security Vulnerabilities

If you discover a security vulnerability within the OSCE System (e.g., IDOR, XSS), please send a report directly to **Ray (QA Lead)**. All security vulnerabilities will be promptly addressed.

## License

The OSCE Management System is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
