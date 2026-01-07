# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo for filmguide.tips, currently containing a single SvelteKit application. The project is in transition from a multi-app Next.js setup to a SvelteKit-based architecture.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5 (using modern runes API)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite)
- **Type Checking**: TypeScript 5.9 with svelte-check
- **Package Manager**: pnpm 10.0.0 (required)
- **Node Version**: >= 22 (required)
- **Deployment**: Vercel (using @sveltejs/adapter-vercel)
- **Monorepo Tool**: Turborepo

## Common Commands

### Development
```bash
pnpm dev                    # Start dev server for all apps (via Turborepo)
pnpm dev --filter=web       # Start dev server for web app only
```

### Building
```bash
pnpm build                  # Build all apps
pnpm build --filter=web     # Build web app only
```

### Code Quality
```bash
pnpm lint                   # Run ESLint and Prettier check on all apps
pnpm format                 # Format all code with Prettier
pnpm check                  # Run svelte-check for type checking
```

### Working in apps/web
```bash
cd apps/web
pnpm dev                    # Start Vite dev server directly
pnpm build                  # Build for production
pnpm preview                # Preview production build
pnpm check                  # Type check with svelte-check
pnpm check:watch            # Type check in watch mode
```

## Architecture

### Monorepo Structure
- **apps/web**: Main SvelteKit application (previously Next.js, now migrated)
- **packages/**: Shared packages (currently being phased out from Next.js setup)

### SvelteKit Application Structure (apps/web)

The web app follows standard SvelteKit conventions:

- **src/routes/**: File-based routing
  - `+page.svelte`: Page components
  - `+layout.svelte`: Layout components (root layout imports global CSS)
  - `+server.ts`: API endpoints (not yet implemented)
  - `+page.ts/+page.server.ts`: Load functions for data fetching

- **src/lib/**: Reusable components, utilities, and assets
  - `$lib` is aliased for imports (e.g., `import { x } from '$lib/utils'`)

- **static/**: Static assets served from root

### Svelte 5 Runes
This project uses Svelte 5, which introduces runes for reactivity:
- Use `$state()` for reactive state (not `let` with assignments)
- Use `$derived()` for computed values (not `$:` reactive statements)
- Use `$effect()` for side effects (not `$:` blocks)
- Props use `let { propName } = $props()` syntax

### Styling
- Tailwind CSS v4 is configured via Vite plugin (@tailwindcss/vite)
- Global styles in `src/routes/layout.css`
- Tailwind plugins enabled: @tailwindcss/forms, @tailwindcss/typography

## Important Configuration Files

- **turbo.json**: Defines Turborepo task pipeline
  - Build outputs: `.svelte-kit/**` and `build/**`
  - Dev task runs persistently without caching

- **apps/web/svelte.config.js**: SvelteKit configuration
  - Uses Vercel adapter
  - Vite preprocessor enabled

- **apps/web/vite.config.ts**: Vite configuration
  - Includes tailwindcss, sveltekit, and devtools-json plugins

## Turborepo Filters

Use `--filter=web` to run tasks in specific workspaces:
```bash
pnpm dev --filter=web
pnpm build --filter=web
pnpm lint --filter=web
```

## Migration Notes

This project was recently migrated from a multi-app Next.js setup to SvelteKit. The following changes were made:
- Removed `apps/docs` (Next.js app)
- Converted `apps/web` from Next.js to SvelteKit
- Updated turbo.json outputs from `.next/**` to `.svelte-kit/**`
- Aligned script names (changed `check-types` to `check`)
- Updated Prettier config to include `.svelte` files
