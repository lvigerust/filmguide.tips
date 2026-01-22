import type { Attachment } from 'svelte/attachments'
import { isSafeRedirect } from '@lvigerust/utils'
import { redirect, type NumericRange } from '@sveltejs/kit'

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
	status: NumericRange<300, 308>,
	location: string | null | undefined,
	fallback?: string
) => never = (status, location, fallback = '/') => {
	const safeUrl = validateRedirect(location, fallback)
	return redirect(status, safeUrl)
}
