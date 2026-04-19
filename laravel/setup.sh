# Laravel Job Board - Setup Script
# Run this on a system with PHP and Composer installed

echo "Creating Laravel Job Board..."

# Create Laravel project
composer create-project laravel/laravel jobboard --prefer-dist

cd jobboard

# Install Supabase package
composer require supabase/supabase-php

# Install Laravel Breeze for authentication
composer require laravel/breeze --dev

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure Supabase in .env
echo "
# Supabase Configuration
SUPABASE_URL=https://crqjedivobupxbbathux.supabase.co
SUPABASE_KEY=your-anon-key-here
" >> .env

# Create database migrations
php artisan make:migration create_jobs_table
php artisan make:migration create_applications_table
php artisan make:migration create_companies_table

# Run migrations
php artisan migrate

# Install Breeze
php artisan breeze:install

# Build assets
npm run build

echo "Laravel Job Board created successfully!"
echo "Run 'php artisan serve' to start the development server."