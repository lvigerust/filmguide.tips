import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type {
	MovieSearchItem,
	MultiSearchResponse,
	PersonSearchItem,
	TmdbError,
	TvSearchItem
} from '$types'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'

export const searchMultiple = query(z.string(), async (searchQuery) => {
	const { fetch } = getRequestEvent()

	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/search/multi?query=${searchQuery}`)

	if (!res.ok) {
		const error: TmdbError = await res.json()
		throw new Error(error.status_message ?? res.statusText)
	}

	const data: MultiSearchResponse = await res.json()

	const movieEntries: [number, MovieSearchItem][] = []
	const tvEntries: [number, TvSearchItem][] = []
	const personEntries: [number, PersonSearchItem][] = []

	for (const item of data.results) {
		if (item.media_type === 'movie') {
			movieEntries.push([item.id, item])
		} else if (item.media_type === 'tv') {
			tvEntries.push([item.id, item])
		} else if (item.media_type === 'person') {
			personEntries.push([item.id, item])
		}
	}

	return {
		movies: new SvelteMap(movieEntries),
		tvShows: new SvelteMap(tvEntries),
		people: new SvelteMap(personEntries)
	}
})
