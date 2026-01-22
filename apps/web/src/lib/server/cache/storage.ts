import { Redis, type RedisConfigNodejs } from '@upstash/redis'
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private'

/**
 * Entry stored in HTTP cache (for ETag-based conditional requests)
 */
export interface HttpCacheEntry {
	etag: string
	body: unknown
	expiresAt: number
}

/**
 * Storage interface for HTTP responses with ETag support
 */
export interface HttpCacheStorage {
	get(url: string): Promise<HttpCacheEntry | null>
	set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void>
}

/**
 * Storage interface for generic key-value caching
 */
export interface KVStorage {
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

const redis = createRedisClient()

/**
 * Redis-backed HTTP cache storage (production)
 */
class RedisHttpStorage implements HttpCacheStorage {
	private redis: Redis

	constructor(redis: Redis) {
		this.redis = redis
	}

	async get(url: string): Promise<HttpCacheEntry | null> {
		try {
			return await this.redis.get<HttpCacheEntry>(url)
		} catch (error) {
			console.error('Redis HTTP cache GET failed:', error instanceof Error ? error.message : error)
			return null
		}
	}

	async set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void> {
		try {
			await this.redis.setex(url, ttlSeconds, {
				etag,
				body,
				expiresAt: Date.now() + ttlSeconds * 1000
			})
		} catch (error) {
			console.error('Redis HTTP cache SET failed:', error instanceof Error ? error.message : error)
			// Fail silently - caching is optional
		}
	}
}

/**
 * In-memory HTTP cache storage (development fallback)
 */
class MemoryHttpStorage implements HttpCacheStorage {
	private cache = new Map<string, HttpCacheEntry>()

	async get(url: string): Promise<HttpCacheEntry | null> {
		const entry = this.cache.get(url)
		if (!entry) return null

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(url)
			return null
		}

		return entry
	}

	async set(url: string, etag: string, body: unknown, ttlSeconds: number): Promise<void> {
		this.cache.set(url, {
			etag,
			body,
			expiresAt: Date.now() + ttlSeconds * 1000
		})
	}
}

/**
 * Redis-backed key-value storage (production)
 */
class RedisKVStorage implements KVStorage {
	private redis: Redis

	constructor(redis: Redis) {
		this.redis = redis
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			return await this.redis.get<T>(key)
		} catch (error) {
			console.error('Redis KV storage GET failed:', error instanceof Error ? error.message : error)
			return null
		}
	}

	async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		try {
			await this.redis.setex(key, ttlSeconds, value)
		} catch (error) {
			console.error('Redis KV storage SET failed:', error instanceof Error ? error.message : error)
		}
	}

	async delete(key: string): Promise<void> {
		try {
			await this.redis.del(key)
		} catch (error) {
			console.error(
				'Redis KV storage DELETE failed:',
				error instanceof Error ? error.message : error
			)
		}
	}
}

/**
 * In-memory key-value storage (development fallback)
 */
class MemoryKVStorage implements KVStorage {
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
 * Auto-select HTTP cache storage based on environment
 */
const createHttpStorage = (): HttpCacheStorage => {
	return redis ? new RedisHttpStorage(redis) : new MemoryHttpStorage()
}

/**
 * Auto-select KV storage based on environment
 */
const createKVStorage = (): KVStorage => {
	return redis ? new RedisKVStorage(redis) : new MemoryKVStorage()
}

export const httpStorage = createHttpStorage()
export const kvStorage = createKVStorage()
