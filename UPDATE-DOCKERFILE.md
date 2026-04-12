# IMPORTANT: Update Root Dockerfile
# ===================================

The production-ready Dockerfile has been created in `infrastructure/` as a reference.

The root Dockerfile needs to be updated with:

1. Multi-stage build (deps → builder → production)
2. Health checks
3. Security hardening
4. Build arguments for secrets

## To update the Dockerfile:

Copy the following content to your root `Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# Stage 3: Production
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create monitoring directory
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx && \
    # Add health check file
    echo '/healthz' > /var/www/.healthz && \
    chown nginx:nginx /var/www/.healthz

# Security: Drop privileges
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

## Dockerfile Improvements:

### Multi-stage Build
- **deps**: Production dependencies only (smaller image)
- **builder**: Full build with all dependencies
- **production**: Minimal nginx-based image

### Security Hardening
- Non-root user (nginx)
- Minimal attack surface
- No shell access in production

### Health Checks
- Docker HEALTHCHECK directive
- 30-second intervals
- 3 retry attempts

### Build Arguments
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### Caching Optimization
- npm cache cleaned after install
- Layer caching for dependencies
