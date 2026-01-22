/**
 * HTTP cache with ETag support for TMDB API responses
 * Enables 304 Not Modified responses via conditional requests
 *
 * Automatically uses:
 * - Upstash Redis (production) - shared across all instances
 * - In-memory Map (development) - per-instance only
 */

import { ETAG_CACHE_EXCLUDE_PATTERNS } from '$lib/config'
import { httpStorage } from './storage'

class HttpCache {
	private readonly excludePatterns = ETAG_CACHE_EXCLUDE_PATTERNS
	private readonly ttlSeconds = 60 * 60 // 1 hour

	async handleRequest(request: Request, fetch: typeof globalThis.fetch): Promise<Response> {
		if (this.shouldCache(request)) {
			return this.handleWithETag(request, fetch)
		}

		return fetch(request)
	}

	private shouldCache(request: Request): boolean {
		return (
			request.method === 'GET' &&
			!this.excludePatterns.some((pattern) => request.url.includes(pattern))
		)
	}

	private async handleWithETag(
		request: Request,
		fetch: typeof globalThis.fetch
	): Promise<Response> {
		const cached = await this.getCached(request.url)

		// Add If-None-Match header if we have a cached ETag
		if (cached) {
			request.headers.set('If-None-Match', cached.etag)
		}

		const response = await fetch(request)

		// Handle 304 Not Modified - return cached body
		if (response.status === 304 && cached) {
			return new Response(JSON.stringify(cached.body), {
				status: 200,
				headers: {
					'content-type': 'application/json'
				}
			})
		}

		// Cache successful responses with ETags
		if (response.ok && response.status === 200) {
			const etag = response.headers.get('etag')
			if (etag) {
				// Clone to read body while preserving original response
				const clone = response.clone()
				const body = await clone.json()
				await this.setCached(request.url, etag, body)
			}
		}

		return response
	}

	private async getCached(url: string) {
		return await httpStorage.get(url)
	}

	private async setCached(url: string, etag: string, body: unknown) {
		await httpStorage.set(url, etag, body, this.ttlSeconds)
	}
}

// Singleton instance
const cache = new HttpCache()

export const handleHttpCacheRequest = (request: Request, fetch: typeof globalThis.fetch) =>
	cache.handleRequest(request, fetch)
