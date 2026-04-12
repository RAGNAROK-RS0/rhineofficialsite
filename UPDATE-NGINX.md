# IMPORTANT: Update Root nginx.conf
# ==================================

The production-ready nginx.conf has been created in `infrastructure/nginx.conf`.

To apply it to the project root, run:

## On Windows (PowerShell):
```powershell
Copy-Item infrastructure/nginx.conf nginx.conf -Force
```

## On Linux/Mac:
```bash
cp infrastructure/nginx.conf nginx.conf
```

## On Windows (Git Bash):
```bash
cp infrastructure/nginx.conf nginx.conf
```

## What the production nginx.conf includes:

1. **Performance Optimizations**
   - Worker process optimization (auto)
   - 2048 worker connections
   - Epoll event model
   - TCP optimizations (tcp_nopush, tcp_nodelay)
   - Gzip compression (6 levels)

2. **Security Hardening**
   - Security headers (CSP, X-Frame-Options, etc.)
   - Rate limiting for general/API/auth endpoints
   - Buffer size limits
   - Hidden file protection
   - Non-root user

3. **Caching**
   - 1-year cache for static assets
   - No-cache for HTML files
   - Immutable cache headers

4. **Health Checks**
   - /healthz endpoint returning "healthy"
   - Docker HEALTHCHECK compatibility

5. **Error Handling**
   - Custom error pages
   - Detailed logging format
