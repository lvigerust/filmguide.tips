import type { Attachment } from 'svelte/attachments'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { redirect } from '@sveltejs/kit'
import type { Media } from '#types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * Formats a date with `Intl.DateTimeFormat`. Date-only strings (`YYYY-MM-DD`, as
 * returned by TMDB) are read as local dates, so they don't shift a day in negative UTC offsets.
 *
 * @example
 * formatDate('2024-03-01') // 'Mar 1, 2024'
 * formatDate('2024-03-01', { year: 'numeric' }) // '2024'
 */
export const formatDate = (
	date: string | number | Date,
	options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
	locale?: Intl.LocalesArgument
) => {
	const value =
		typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
			? new Date(`${date}T00:00:00`)
			: new Date(date)
	return new Intl.DateTimeFormat(locale, options).format(value)
}

export const formatNumber = (
	value: number,
	options?: Intl.NumberFormatOptions,
	locale?: Intl.LocalesArgument
) => new Intl.NumberFormat(locale, options).format(value)

/**
 * Converts text to a URL slug: lowercase ASCII letters and digits joined by hyphens.
 *
 * @example
 * slugify('Amélie & Co.') // 'amelie-co'
 */
export const slugify = (text: string) =>
	text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

/**
 * Checks that a redirect target is a same-origin path. Rejects absolute URLs,
 * protocol-relative URLs (`//evil.com`) and backslash variants (`/\evil.com`).
 */
export const isSafeRedirect = (url: string) => {
	if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) return false
	try {
		const base = 'http://localhost'
		return new URL(url, base).origin === base
	} catch {
		return false
	}
}

export const ref = <T extends Element>(set: (node: T | null) => void): Attachment<T> => {
	return (node) => {
		set(node)
		return () => set(null)
	}
}

/**
 * Validates a redirect URL and returns it if safe, otherwise returns fallback.
 * Use this when you need a validated URL string without redirecting.
 *
 * @param location - The URL to validate (can be null/undefined)
 * @param fallback - Fallback URL if validation fails (defaults to '/')
 * @returns The validated URL string or fallback
 *
 * @example
 * const validUrl = validateRedirect(url.searchParams.get('redirectTo'))
 */
export const validateRedirect = (location: string | null | undefined, fallback = '/'): string => {
	const url = location || fallback
	return isSafeRedirect(url) ? url : fallback
}

/**
 * Validates and throws a safe redirect with the given status code.
 * Prevents open redirect vulnerabilities by validating the destination URL.
 *
 * @param status - HTTP status code (300-308)
 * @param location - The URL to redirect to (validated for safety)
 * @param fallback - Fallback URL if location is unsafe (defaults to '/')
 * @throws {Redirect} SvelteKit redirect with validated location
 *
 * @example
 * safeRedirect(303, url.searchParams.get('redirectTo'))
 */
export const safeRedirect: (
	status: Parameters<typeof redirect>[0],
	location: string | null | undefined,
	fallback?: string
) => never = (status, location, fallback = '/') => {
	const safeUrl = validateRedirect(location, fallback)
	return redirect(status, safeUrl)
}

export const createSlug = (item: Media) => {
	return `${item.media_type}/${item.id}-${slugify(item.media_type === 'movie' ? item.title : item.name)}` as const
}
