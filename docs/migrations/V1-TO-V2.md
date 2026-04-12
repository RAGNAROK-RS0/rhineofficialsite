# Migration Guide: v1 to v2

**From**: Phase 1-50 (v1)  
**To**: Phase 51-70 (v2)  
**Date**: April 2026

---

## Breaking Changes

### 1. Component Imports

**Before (v1)**:
```typescript
import Skeleton from './components/Skeleton';
import ErrorBoundary from './components/ErrorBoundary';
```

**After (v2)**:
```typescript
import { Skeleton, SkeletonCard } from './components/ui/Skeleton';
import ErrorBoundary from './components/ErrorBoundary'; // unchanged
```

### 2. Custom Hook Exports

**Before (v1)**:
```typescript
import { useThemeHue } from '../hooks/useThemeHue';
```

**After (v2)**:
```typescript
import useThemeHue from '../hooks/useThemeHue'; // default export
```

### 3. Storybook Configuration

**Before (v1)**:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
```

**After (v2)**:
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
```

---

## New Features

### Optimized Image Loading

```typescript
import { OptimizedImage } from './components/ui/OptimizedImage';

// Before: <img src="..." />
// After:
<OptimizedImage
  src="image.jpg"
  alt="Description"
  placeholder="blur-hash-or-svg"
  loading="lazy"
/>
```

### Skeleton Loading States

```typescript
import { Skeleton, SkeletonCard, SkeletonGrid } from './components/ui/Skeleton';

// Individual skeleton
<Skeleton variant="text" count={3} />

// Card skeleton
<SkeletonCard lines={4} showAvatar showImage />

// Grid skeleton
<SkeletonGrid count={6} columns={3} />
```

### Toast Notifications

```typescript
import { ToastProvider, ToastContainer, useToast } from './components/ui/Toast';

// Wrap your app
<ToastProvider>
  <App />
  <ToastContainer />
</ToastProvider>

// Use in components
function MyComponent() {
  const { showToast } = useToast();
  showToast('Success!', 'success');
}
```

### Route Prefetching

```typescript
import { LinkPrefetch, usePrefetch } from './hooks/usePrefetch';

// Link that prefetches on hover
<LinkPrefetch to="/about" className="nav-link">
  About
</LinkPrefetch>
```

### Presence Tracking

```typescript
import { usePresence } from './hooks/usePresence';

function Collaboration() {
  const { onlineUsers, onlineCount } = usePresence('room-123');
  return <div>{onlineCount} users online</div>;
}
```

---

## Deprecated Features

| Feature | Deprecated | Replacement | Removal Date |
|---------|------------|-------------|--------------|
| `@storybook/react` imports | v2 | `@storybook/react-vite` | v3 |
| Named export `useThemeHue` | v2 | Default export | v3 |
| Direct `three` imports | v2 | Separate chunks | v3 |

---

## Configuration Changes

### Vite Config

The `vite.config.ts` has been updated with:

1. Improved code splitting
2. Terser minification (optional)
3. Bundle size warnings at 500KB

### Environment Variables

No changes required. All `VITE_` prefixed variables continue to work.

---

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm test
```

### Test Coverage

New tests added for:
- `useAuth` hook
- `useThemeHue` hook
- Security utilities
- Skeleton components

---

## Migration Checklist

- [ ] Update Storybook imports to `@storybook/react-vite`
- [ ] Update `useThemeHue` import to use default export
- [ ] Add `<ToastProvider>` wrapper if using toasts
- [ ] Update CI/CD workflow if using custom GitHub Actions
- [ ] Run `npm install` for new dependencies
- [ ] Run `npm run build` to verify

---

## Need Help?

- Check the [API Documentation](./API.md)
- Review [CHANGELOG.md](./CHANGELOG.md)
- Open an issue on GitHub

---

*Migration Guide Version: 2.0*  
*Last Updated: April 2026*
