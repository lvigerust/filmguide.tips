/**
 * Generic cache for user sessions and other key-value data
 * Uses Upstash Redis (production) or in-memory Map (fallback)
 * Automatically selects backend based on environment variables
 */

import type { Response } from '$types'
import { kvStorage } from './storage'

export class SessionCache<T> {
	private storage = kvStorage

	async get(key: string): Promise<T | null> {
		return await this.storage.get<T>(key)
	}

	async set(key: string, value: T, ttlSeconds: number): Promise<void> {
		await this.storage.set(key, value, ttlSeconds)
	}

	async delete(key: string): Promise<void> {
		await this.storage.delete(key)
	}
}

export const userSessionCache = new SessionCache<Response<'account-details'>>()
