import { getRequestEvent, query } from '$app/server'
import { TMDB_BASE_URL } from '$env/static/private'
import type { APIResponse, Show } from '$types'
import { z } from 'zod/v4'

const lists = ['airing_today', 'on_the_air', 'popular', 'top_rated'] as const

export const getTvShows = query(
	z.object({
		list: z.enum(lists),
		page: z.number().positive().default(1)
	}),
	async ({ list, page = 1 }) => {
		const { fetch } = getRequestEvent()

		const fetchPage = async (pageNumber: number) => {
			const res = await fetch(`${TMDB_BASE_URL}/tv/${list}?page=${pageNumber}`)
			if (!res.ok) throw new Error(res.statusText)
			return (await res.json()) as APIResponse<Show>
		}

		const responses = await Promise.all(Array.from({ length: page }, (_, i) => fetchPage(i + 1)))
		const seen = new Set<number>()

		return responses
			.flatMap((r) => r.results)
			.filter((m) => (seen.has(m.id) ? false : seen.add(m.id)))
	}
)
