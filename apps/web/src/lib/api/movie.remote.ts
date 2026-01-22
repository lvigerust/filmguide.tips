import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'
import {
	append_movie_options,
	movieLists,
	type Movie,
	type MovieDetails,
	type MovieDetailsWithAppends,
	type MovieListResponse
} from '$types'

export const getMovies = query(
	z.enum(movieLists),
	async (list): Promise<SvelteMap<number, Movie>> => {
		const { fetch } = getRequestEvent()

		const url =
			list === 'trending'
				? `${PUBLIC_TMDB_BASE_URL}/trending/movie/week`
				: `${PUBLIC_TMDB_BASE_URL}/movie/${list}`

		const res = await fetch(url)
		if (!res.ok) throw new Error(res.statusText)

		const data: MovieListResponse = await res.json()

		const movies = new SvelteMap<number, Movie>()

		for (const movie of data.results ?? []) {
			movies.set(movie.id, { ...movie, media_type: 'movie' })
		}

		return movies
	}
)

export const getMovieDetails = query(
	z.object({ id: z.string(), append: z.array(z.enum(append_movie_options)).optional() }),
	async ({ id, append }): Promise<MovieDetails & MovieDetailsWithAppends> => {
		const { fetch } = getRequestEvent()

		const url = new URL(`${PUBLIC_TMDB_BASE_URL}/movie/${id}`)
		if (append?.length) url.searchParams.set('append_to_response', append.join(','))

		const res = await fetch(url)
		if (!res.ok) throw new Error(res.statusText)

		const movie = await res.json()
		return { ...movie, media_type: 'movie' }
	}
)
