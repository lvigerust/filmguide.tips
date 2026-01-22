import type { Attachment } from 'svelte/attachments'
import { isSafeRedirect } from '@lvigerust/utils'

export const ref = <T extends Element>(set: (node: T | null) => void): Attachment<T> => {
	return (node) => {
		set(node)
		return () => set(null)
	}
}

/**
 * Validates a redirect URL and returns it if safe, otherwise returns '/'
 * @param redirectUrl - The URL to validate (can be null/undefined)
 * @param fallback - The fallback URL if validation fails (defaults to '/')
 * @returns The validated redirect URL or fallback
 */
export const safeRedirect = (redirectUrl: string | null | undefined, fallback = '/'): string => {
	const url = redirectUrl || fallback
	return isSafeRedirect(url) ? url : fallback
}
