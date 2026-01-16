import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { COUNTRIES } from '$lib/config'
import type { TmdbError, WatchProviders } from '$types'
import { z } from 'zod/v4'

export const getWatchProviders = query(
	z.object({ id: z.number(), media_type: z.enum(['movie', 'tv']) }),
	async ({ id, media_type }) => {
		const { fetch } = getRequestEvent()

		const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/${media_type}/${id}/watch/providers`)

		if (!res.ok) {
			const error: TmdbError = await res.json()
			throw new Error(error.status_message ?? res.statusText)
		}

		const data: WatchProviders = await res.json()

		if (!data.results) return null

		const filtered = Object.fromEntries(
			Object.entries(data.results).filter(([code]) => code in COUNTRIES)
		) as NonNullable<WatchProviders['results']>

		return filtered
	}
)
