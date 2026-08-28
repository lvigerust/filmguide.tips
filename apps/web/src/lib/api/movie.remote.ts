import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$app/env/public'
import { SvelteMap } from 'svelte/reactivity'
import { z } from 'zod/v4'
import {
	append_movie_options,
	movieLists,
	type Movie,
	type MovieDetails,
	type MovieDetailsWithAppends,
	type MovieListResponse
} from '#types'

export const getMovies = query(
	z.object({ list: z.enum(movieLists), page: z.number().int().min(1).max(500) }),
	async ({
		list,
		page
	}): Promise<{ movies: SvelteMap<number, Movie>; page: number; totalPages: number }> => {
		const { fetch } = getRequestEvent()

		const url = new URL(
			list === 'trending'
				? `${PUBLIC_TMDB_BASE_URL}/trending/movie/week`
				: `${PUBLIC_TMDB_BASE_URL}/movie/${list}`
		)
		url.searchParams.set('page', String(page))

		const res = await fetch(url)

		if (!res.ok) throw new Error(res.statusText)

		const data: MovieListResponse = await res.json()
		const movies = new SvelteMap<number, Movie>()

		for (const movie of data.results ?? []) {
			if (!movie.title) continue
			movies.set(movie.id, { ...movie, title: movie.title, media_type: 'movie' })
		}

		return { movies, page: data.page, totalPages: data.total_pages }
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
