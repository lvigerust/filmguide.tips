import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { APIResponse, Movie } from '$types'
import { z } from 'zod/v4'

const lists = ['now_playing', 'popular', 'top_rated', 'upcoming'] as const

export const getMovies = query(
	z.object({
		list: z.enum(lists),
		page: z.number().positive().default(1)
	}),
	async ({ list, page = 1 }) => {
		const { fetch } = getRequestEvent()

		const fetchPage = async (pageNumber: number) => {
			const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/movie/${list}?page=${pageNumber}`)
			if (!res.ok) throw new Error(res.statusText)
			return (await res.json()) as APIResponse<Movie>
		}

		const responses = await Promise.all(Array.from({ length: page }, (_, i) => fetchPage(i + 1)))
		const seen = new Set<number>()

		return responses
			.flatMap((r) => r.results)
			.filter((m) => (seen.has(m.id) ? false : seen.add(m.id)))
	}
)
