import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { APIResponse, Images, Movie } from '$types'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'

const lists = ['now_playing', 'popular', 'top_rated', 'upcoming', 'trending'] as const

export const getMovies = query(
	z.object({
		list: z.enum(lists),
		page: z.number().positive().default(1)
	}),
	async ({ list, page = 1 }) => {
		const { fetch } = getRequestEvent()

		const endpoint =
			list === 'trending'
				? `${PUBLIC_TMDB_BASE_URL}/trending/movie/week`
				: `${PUBLIC_TMDB_BASE_URL}/movie/${list}`

		const fetchPage = async (pageNumber: number) => {
			const res = await fetch(`${endpoint}?page=${pageNumber}`)
			if (!res.ok) throw new Error(res.statusText)
			return (await res.json()) as APIResponse<Movie>
		}

		const responses = await Promise.all(Array.from({ length: page }, (_, i) => fetchPage(i + 1)))

		return new SvelteMap<number, Movie>(
			responses
				.flatMap((r) => r.results)
				.map((movie) => [movie.id, { ...movie, media_type: 'movie' as const }])
		)
	}
)

export const getMovie = query(z.string(), async (id) => {
	const { fetch } = getRequestEvent()

	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/movie/${id}`)
	if (!res.ok) throw new Error(res.statusText)
	return (await res.json()) as Movie
})

export const getMovieImages = query(
	z.object({ id: z.number(), media_type: z.string() }),
	async ({ id, media_type }) => {
		const { fetch } = getRequestEvent()

		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/${media_type}/${id}/images?include_image_language=en-US,null`
		)
		if (!res.ok) throw new Error(res.statusText)
		return (await res.json()) as Images
	}
)
