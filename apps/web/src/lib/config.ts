import { dev } from '$app/environment'
import type { Cookies } from '@sveltejs/kit'

export const cookiesConfig: Parameters<Cookies['set']>[2] = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: !dev
}

export const navItems = [
	{ label: 'Movies', href: '/movie' },
	{ label: 'TV Shows', href: '/tv' }
]

export const COUNTRIES = {
	US: 'United States',
	CA: 'Canada',
	GB: 'United Kingdom',
	NO: 'Norway'
}

export const ETAG_CACHE_EXCLUDE_PATTERNS = [
	'/authentication/', // Auth tokens must always be fresh
	'/account' // Already has application-level cache
]
