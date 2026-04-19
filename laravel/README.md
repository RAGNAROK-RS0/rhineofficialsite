# Laravel - Job Board Application

A full-stack job board application built with Laravel 11.

## Features

- User authentication (Breeze/Jetstream)
- Job listings CRUD
- Employer/Employee roles
- File uploads to Supabase Storage
- Email notifications with queues
- Application tracking
- Admin dashboard

## Prerequisites

- PHP 8.2+
- Composer
- Node.js
- Supabase account

## Installation

```bash
# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database migrations
php artisan migrate

# Build assets
npm run build

# Start server
php artisan serve
```

## Project Structure

```
laravel/
├── app/
│   ├── Http/Controllers/
│   ├── Models/
│   ├── Policies/
│   └── Providers/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── views/
│   └── js/
├── routes/
└── tests/
```

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | / | Home page |
| GET | /jobs | Job listings |
| GET | /jobs/{id} | Job detail |
| POST | /jobs | Create job (employer) |
| POST | /jobs/{id}/apply | Apply for job |
| GET | /dashboard | User dashboard |
| GET | /admin | Admin panel |

## Models

- `User` - extends Authenticable
- `Job` - Job listing
- `Application` - Job application
- `Company` - Employer company profile

## Policies

- `JobPolicy` - Authorization for job CRUD
- `ApplicationPolicy` - Authorization for applications

## Learning Outcomes

- [ ] Laravel installation and setup
- [ ] MVC architecture
- [ ] Eloquent ORM
- [ ] Database migrations
- [ ] Authentication
- [ ] Authorization (Policies/Gates)
- [ ] File uploads
- [ ] Email queues
- [ ] API routes
- [ ] Blade components
- [ ] Livewire (optional)