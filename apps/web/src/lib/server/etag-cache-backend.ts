import { Redis, type RedisConfigNodejs } from '@upstash/redis'
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private'

export interface CacheEntry {
	etag: string
	body: unknown
	timestamp: number
}

interface CacheBackend {
	get(url: string): Promise<CacheEntry | null>
	set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void>
}

/**
 * Generic cache backend for arbitrary values
 */
export interface GenericCacheBackend {
	get<T>(key: string): Promise<T | null>
	set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
	delete(key: string): Promise<void>
}

/**
 * Shared Redis instance for all cache operations
 * Configured with automatic retries and exponential backoff for serverless reliability
 */
const createRedisClient = (): Redis | null => {
	if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
		return null
	}

	const config: RedisConfigNodejs = {
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN,
		retry: {
			retries: 5,
			backoff: (retryCount) => Math.exp(retryCount) * 50 // 50ms, 135ms, 367ms, 998ms, 2718ms
		},
		cache: 'no-store' // Disable fetch cache for fresh data
	}

	return new Redis(config)
}

const sharedRedis = createRedisClient()

/**
 * Upstash Redis backend (production)
 */
class UpstashBackend implements CacheBackend {
	private redis: Redis

	constructor(redis: Redis) {
		this.redis = redis
	}

	async get(url: string): Promise<CacheEntry | null> {
		try {
			return await this.redis.get<CacheEntry>(url)
		} catch (error) {
			console.error('Upstash GET failed:', error instanceof Error ? error.message : error)
			return null
		}
	}

	async set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void> {
		try {
			await this.redis.setex(url, ttlSeconds, {
				etag,
				body,
				timestamp: Date.now()
			})
		} catch (error) {
			console.error('Upstash SET failed:', error instanceof Error ? error.message : error)
			// Fail silently - caching is optional
		}
	}
}

/**
 * In-memory backend (development fallback)
 */
class MemoryBackend implements CacheBackend {
	private cache = new Map<string, CacheEntry>()
	private readonly MAX_AGE_MS = 1000 * 60 * 60 // 60 minutes

	async get(url: string): Promise<CacheEntry | null> {
		const entry = this.cache.get(url)
		if (!entry) return null

		if (Date.now() - entry.timestamp > this.MAX_AGE_MS) {
			this.cache.delete(url)
			return null
		}

		return entry
	}

	async set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void> {
		this.cache.set(url, {
			etag,
			body,
			timestamp: Date.now()
		})
	}
}

/**
 * Generic Upstash backend (production)
 */
class GenericUpstashBackend implements GenericCacheBackend {
	private redis: Redis

	constructor(redis: Redis) {
		this.redis = redis
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			return await this.redis.get<T>(key)
		} catch (error) {
			console.error('Upstash GET failed:', error instanceof Error ? error.message : error)
			return null
		}
	}

	async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		try {
			await this.redis.setex(key, ttlSeconds, value)
		} catch (error) {
			console.error('Upstash SET failed:', error instanceof Error ? error.message : error)
		}
	}

	async delete(key: string): Promise<void> {
		try {
			await this.redis.del(key)
		} catch (error) {
			console.error('Upstash DELETE failed:', error instanceof Error ? error.message : error)
		}
	}
}

/**
 * Generic in-memory backend (development fallback)
 */
class GenericMemoryBackend implements GenericCacheBackend {
	private cache = new Map<string, { value: unknown; expiresAt: number }>()

	async get<T>(key: string): Promise<T | null> {
		const entry = this.cache.get(key)
		if (!entry) return null

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key)
			return null
		}

		return entry.value as T
	}

	async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		this.cache.set(key, {
			value,
			expiresAt: Date.now() + ttlSeconds * 1000
		})
	}

	async delete(key: string): Promise<void> {
		this.cache.delete(key)
	}
}

/**
 * Auto-select backend based on environment
 */
const createBackend = (): CacheBackend => {
	if (sharedRedis) {
		console.log('✓ Using Upstash Redis for ETag cache')
		return new UpstashBackend(sharedRedis)
	}

	console.log('⚠ Using in-memory ETag cache (Upstash credentials missing)')
	return new MemoryBackend()
}

const createGenericBackend = (): GenericCacheBackend => {
	if (sharedRedis) {
		return new GenericUpstashBackend(sharedRedis)
	}

	return new GenericMemoryBackend()
}

export const backend = createBackend()
export const genericBackend = createGenericBackend()
