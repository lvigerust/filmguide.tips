import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({
	TMDB_API_KEY: { static: true },
	UPSTASH_REDIS_REST_TOKEN: { static: true },
	UPSTASH_REDIS_REST_URL: { static: true },
	PUBLIC_TMDB_BASE_URL: { public: true, static: true },
	PUBLIC_TMDB_IMG_URL: { public: true, static: true }
})
