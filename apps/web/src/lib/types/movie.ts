import type { Response, ResultItem } from '$types'

// Movie types (raw from API)
export type MovieListResponse = Response<'movie-popular-list'>
export type MovieListItem = ResultItem<'movie-popular-list'>
export type MovieDetails = Response<'movie-details'>
export type MovieImages = Response<'movie-images'>
export type MovieWatchProviders = Response<'movie-watch-providers'>

export type TrendingMovieResponse = Response<'trending-movies'>

export type Movie = (MovieListItem | MovieDetails) & { media_type: 'movie' }

// Extract the country provider data type from watch providers results
export type CountryProviders = NonNullable<MovieWatchProviders['results']>[keyof NonNullable<
	MovieWatchProviders['results']
>]
