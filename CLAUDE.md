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
- Environment variables: `TMDB_API_KEY` (private), `PUBLIC_TMDB_BASE_URL` (public)

### Experimental Features Enabled
- **remoteFunctions**: Server functions callable from components via `query()`
- **async components**: Top-level `await` in `.svelte` files (e.g., `{await getMovies(...)}`)

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

### Component Structure
- **Carousel/**: Base carousel with CarouselItem
- **HeroCarousel, PosterCarousel, BackdropCarousel**: Specialized movie/show carousels
- **Image**: TMDB image wrapper with size variants
- **Logo**: Fetches and displays movie/show logos from TMDB
