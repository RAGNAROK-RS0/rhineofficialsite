# Rhine Solution - Infrastructure

This folder contains production-ready infrastructure configuration.

## Contents

```
infrastructure/
├── nginx.conf              # Production nginx configuration
├── nginx.production.conf   # Alternative production config (same as nginx.conf)
├── docker-compose.yml      # Docker Compose configuration
├── deploy.sh               # Deployment automation script
├── setup.sh                # Setup script to apply configs to root
└── .env.production.example # Environment variables template
```

## Quick Start

### 1. Setup Infrastructure

```bash
# Run the setup script to apply configs to project root
bash infrastructure/setup.sh

# Or manually:
cp infrastructure/nginx.conf ../nginx.conf
cp infrastructure/docker-compose.yml ../
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.production.example ../.env.production

# Edit with your actual values
nano ../.env.production
```

### 3. Deploy

```bash
# Make deploy script executable
chmod +x infrastructure/deploy.sh

# Deploy to production
./infrastructure/deploy.sh deploy

# Or use docker-compose directly
docker compose up -d
```

## Production Features

### Nginx Hardening
- ✅ Rate limiting (general, API, auth endpoints)
- ✅ Gzip compression
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Static asset caching
- ✅ Health check endpoint
- ✅ Worker process optimization

### Docker Hardening
- ✅ Multi-stage build (deps → builder → production)
- ✅ Non-root user (nginx)
- ✅ Health checks
- ✅ Build arguments for secrets
- ✅ Optimized layer caching

### CI/CD Pipeline
- ✅ Lint & type check
- ✅ Unit tests with coverage
- ✅ E2E tests (Playwright)
- ✅ Storybook build
- ✅ Security audit (npm audit, Trivy)
- ✅ Staging deployment
- ✅ Production deployment
- ✅ GitHub Releases

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |

## Deployment Commands

```bash
# Build only
./infrastructure/deploy.sh build

# Deploy (build + migrate + deploy)
./infrastructure/deploy.sh deploy

# Check status
./infrastructure/deploy.sh status

# View logs
./infrastructure/deploy.sh logs

# Rollback
./infrastructure/deploy.sh rollback

# Clean up
./infrastructure/deploy.sh clean
```

## Health Check

The application exposes a health endpoint at `/healthz`. You can check it with:

```bash
curl http://localhost/healthz
# Returns: healthy
```

## Monitoring

The monitoring library (`src/lib/monitoring.ts`) sends metrics to:
- Console (development)
- Sentry (production, if configured)
- Custom analytics endpoint (if configured)
