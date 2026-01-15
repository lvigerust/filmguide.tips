import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { APIResponse, Show } from '$types'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'

const lists = ['airing_today', 'on_the_air', 'popular', 'top_rated', 'trending'] as const

export const getTvShows = query(
	z.object({
		list: z.enum(lists),
		page: z.number().positive().default(1)
	}),
	async ({ list, page = 1 }) => {
		const { fetch } = getRequestEvent()

		const endpoint =
			list === 'trending'
				? `${PUBLIC_TMDB_BASE_URL}/trending/tv/week`
				: `${PUBLIC_TMDB_BASE_URL}/tv/${list}`

		const fetchPage = async (pageNumber: number) => {
			const res = await fetch(`${endpoint}?page=${pageNumber}`)
			if (!res.ok) throw new Error(res.statusText)
			const shows: APIResponse<Show> = await res.json()
			return shows
		}

		const responses = await Promise.all(Array.from({ length: page }, (_, i) => fetchPage(i + 1)))

		return new SvelteMap<number, Show>(
			responses
				.flatMap((r) => r.results)
				.map((show) => [show.id, { ...show, media_type: 'tv' as const }])
		)
	}
)

export const getTvShow = query(z.string(), async (id) => {
	const { fetch } = getRequestEvent()

	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/tv/${id}`)
	if (!res.ok) throw new Error(res.statusText)

	const show: Show = await res.json()
	return { ...show, media_type: 'tv' as const }
})
