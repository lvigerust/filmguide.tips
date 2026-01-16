import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import {
	append_tv_options,
	type TvDetailsWithAppends,
	type TvDetails,
	type TvListItem,
	type TvListResponse,
	type TvSeasonDetails
} from '$types'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'

const lists = ['airing_today', 'on_the_air', 'popular', 'top_rated', 'trending'] as const

export const getShows = query(
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
			const shows: TvListResponse = await res.json()
			return shows
		}

		const responses = await Promise.all(Array.from({ length: page }, (_, i) => fetchPage(i + 1)))

		return new SvelteMap<number, TvListItem & { media_type: 'tv' }>(
			responses
				.flatMap((r) => r.results ?? [])
				.map((show) => [show.id, { ...show, media_type: 'tv' as const }])
		)
	}
)

export const getShowDetails = query(
	z.object({ id: z.string(), append: z.array(z.enum(append_tv_options)) }),
	async ({ id, append }) => {
		const { fetch } = getRequestEvent()
		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/tv/${id}?append_to_response=${append.join(',')}`
		)
		if (!res.ok) throw new Error(res.statusText)

		const show: TvDetailsWithAppends = await res.json()
		return { ...show, media_type: 'tv' as const }
	}
)

const SEASONS_PER_PAGE = 5

export const getShowSeasons = query(
	z.object({
		id: z.string(),
		numberOfSeasons: z.number(),
		offset: z.number().default(0)
	}),
	async ({ id, numberOfSeasons, offset = 0 }) => {
		const { fetch } = getRequestEvent()

		const remaining = numberOfSeasons - offset
		const count = Math.min(remaining, SEASONS_PER_PAGE)

		const seasonKeys = Array.from({ length: count }, (_, i) => `season/${offset + i + 1}`)
		const appendToResponse = seasonKeys.join(',')

		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/tv/${id}?append_to_response=${appendToResponse}`
		)
		if (!res.ok) throw new Error(res.statusText)

		const data: TvDetails & Record<`season/${number}`, TvSeasonDetails> = await res.json()

		return new SvelteMap<number, TvSeasonDetails>(
			seasonKeys.map((key) => [
				data[key as `season/${number}`].season_number,
				data[key as `season/${number}`]
			])
		)
	}
)
