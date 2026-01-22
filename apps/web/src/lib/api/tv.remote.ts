import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import {
	append_show_options,
	showLists,
	type Show,
	type ShowDetails,
	type ShowDetailsResponse,
	type ShowDetailsWithAppends,
	type ShowListResponse,
	type ShowSeasonDetails
} from '$types'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'

export const getShows = query(z.enum(showLists), async (list): Promise<SvelteMap<number, Show>> => {
	const { fetch } = getRequestEvent()

	const endpoint =
		list === 'trending'
			? `${PUBLIC_TMDB_BASE_URL}/trending/tv/week`
			: `${PUBLIC_TMDB_BASE_URL}/tv/${list}`

	const res = await fetch(endpoint)
	if (!res.ok) throw new Error(res.statusText)

	const data: ShowListResponse = await res.json()

	const shows = new SvelteMap<number, Show>()

	for (const show of data.results ?? []) {
		shows.set(show.id, { ...show, media_type: 'tv' })
	}

	return shows
})

export const getShowDetails = query(
	z.object({ id: z.string(), append: z.array(z.enum(append_show_options)) }),
	async ({ id, append }): Promise<ShowDetails & ShowDetailsWithAppends> => {
		const { fetch } = getRequestEvent()

		const url = new URL(`${PUBLIC_TMDB_BASE_URL}/tv/${id}`)
		url.searchParams.set('append_to_response', append.join(','))

		const res = await fetch(url)
		if (!res.ok) throw new Error(res.statusText)

		const show = await res.json()
		return { ...show, media_type: 'tv' }
	}
)

const SEASONS_PER_PAGE = 5

export const getShowSeasons = query(
	z.object({
		id: z.string(),
		numberOfSeasons: z.number(),
		offset: z.number().optional()
	}),
	async ({ id, numberOfSeasons, offset = 0 }) => {
		const { fetch } = getRequestEvent()

		const remaining = numberOfSeasons - offset
		const count = Math.min(remaining, SEASONS_PER_PAGE)

		const seasonKeys = Array.from({ length: count }, (_, i) => `season/${offset + i + 1}`)

		const url = new URL(`${PUBLIC_TMDB_BASE_URL}/tv/${id}`)
		url.searchParams.set('append_to_response', seasonKeys.join(','))

		const res = await fetch(url)
		if (!res.ok) throw new Error(res.statusText)

		const data: ShowDetailsResponse & Record<`season/${number}`, ShowSeasonDetails> =
			await res.json()

		return new SvelteMap<number, ShowSeasonDetails>(
			seasonKeys.map((key) => [
				data[key as `season/${number}`].season_number,
				data[key as `season/${number}`]
			])
		)
	}
)
