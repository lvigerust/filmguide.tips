/**
 * Generic cache using Upstash Redis (production) or in-memory Map (fallback)
 * Automatically selects backend based on environment variables
 */

import type { Response } from '$types'
import { genericBackend } from './etag-cache-backend'

export class Cache<T> {
	private backend = genericBackend

	async get(key: string): Promise<T | null> {
		return await this.backend.get<T>(key)
	}

	async set(key: string, value: T, ttlSeconds: number): Promise<void> {
		await this.backend.set(key, value, ttlSeconds)
	}

	async delete(key: string): Promise<void> {
		await this.backend.delete(key)
	}
}

export const accountCache = new Cache<Response<'account-details'>>()
