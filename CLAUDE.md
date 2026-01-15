# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Turborepo monorepo for filmguide.tips - a movie/TV discovery app powered by TMDB API.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5 (runes API)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite)
- **Package Manager**: pnpm 10.0.0 (required)
- **Node Version**: >= 22 (required)
- **Deployment**: Vercel

## Commands

```bash
# From monorepo root
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm lint                   # ESLint + Prettier check
pnpm format                 # Format with Prettier
pnpm check                  # Type check with svelte-check

# Filter to web app only
pnpm dev --filter=web
```

## Architecture

### Path Aliases (apps/web)
```typescript
$components  →  src/lib/components
$api         →  src/lib/api
$types       →  src/lib/types
$utils       →  src/lib/utils
$lib         →  src/lib (default SvelteKit alias)
```

### TMDB API Integration
- **hooks.server.ts**: Intercepts fetch requests to TMDB base URL and injects auth header
- **$api/**: Remote functions using SvelteKit's experimental `query()` with Zod validation
- Remote functions return `SvelteMap` for reactive collections (enables fine-grained reactivity)
- Environment variables:
  - `TMDB_API_KEY` (private) - API authentication
  - `PUBLIC_TMDB_BASE_URL` (public) - API base URL
  - `PUBLIC_TMDB_IMG_URL` (public) - Image CDN URL

### Experimental Features Enabled
- **remoteFunctions**: Server functions callable from components via `query()` from `$app/server`
- **async components**: Top-level `await` in `.svelte` files (e.g., `{await getMovies(...)}`)

### Remote Function Pattern
```typescript
// $api/movie.remote.ts - must end with .remote.ts
import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'  // Note: zod/v4 import for Zod 4

export const getMovies = query(
  z.object({ list: z.enum(['popular', 'trending']), page: z.number() }),
  async ({ list, page }) => {
    const { fetch } = getRequestEvent()
    // fetch automatically has auth header injected via hooks.server.ts
    return new SvelteMap(...)  // Return SvelteMap for reactive collections
  }
)
```

### External Packages
- `@lvigerust/components`: Shared UI components (Heading, etc.)
- `@lvigerust/utils`: Utility functions (cn for class merging)
- `bits-ui`: Headless component primitives

### Svelte 5 Patterns
```typescript
let state = $state()           // Reactive state
let computed = $derived()      // Computed values
$effect(() => { ... })         // Side effects
let { prop } = $props()        // Component props
```

### Route Structure
- `/` - Home page
- `/movie` - Movie listings
- `/movie/[id]` - Movie detail (uses `+page.server.ts` for data loading)
- `/tv` - TV show listings
- `/tv/[id]` - TV show detail

### Key Components
- **Carousel/**: Base carousel with CarouselItem (used as foundation)
- **HeroCarousel, PosterCarousel, BackdropCarousel**: Specialized carousels for different layouts
- **Image**: TMDB image wrapper with responsive srcset (poster vs backdrop sizes)
- **Logo**: Fetches and displays movie/show logos from TMDB
