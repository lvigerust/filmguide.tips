import type { Response, ResultItem } from '$types'

// Raw API response types
export type MovieListResponse = Response<'movie-popular-list'>
export type MovieListItemResponse = ResultItem<'movie-popular-list'>
export type MovieDetailsResponse = Response<'movie-details'>
export type TrendingMovieResponse = Response<'trending-movies'>

// Standalone endpoint types (used across codebase)
export type MovieImages = Response<'movie-images'>
export type MovieWatchProviders = Response<'movie-watch-providers'>

// Public types with media_type discriminator
export type Movie = MovieListItemResponse & { media_type: 'movie' }
export type MovieDetails = MovieDetailsResponse & { media_type: 'movie' }

// Append to response options
export const append_movie_options = [
	'videos',
	'credits',
	'images',
	'keywords',
	'reviews',
	'similar',
	'recommendations',
	'external_ids',
	'alternative_titles',
	'release_dates',
	'translations',
	'watch/providers',
	'account_states',
	'changes',
	'lists',
	'rating'
] as const

export type MovieAppendToResponse = (typeof append_movie_options)[number]

export type MovieAppendResponses = {
	videos?: Response<'movie-videos'>
	credits?: Response<'movie-credits'>
	images?: MovieImages
	keywords?: Response<'movie-keywords'>
	reviews?: Response<'movie-reviews'>
	similar?: Response<'movie-similar'>
	recommendations?: Response<'movie-recommendations'>
	external_ids?: Response<'movie-external-ids'>
	alternative_titles?: Response<'movie-alternative-titles'>
	release_dates?: Response<'movie-release-dates'>
	translations?: Response<'movie-translations'>
	'watch/providers'?: MovieWatchProviders
	account_states?: Response<'movie-account-states'>
	changes?: Response<'movie-changes'>
	lists?: Response<'movie-lists'>
	rating?: Response<'movie-add-rating'>
}

export type MovieDetailsWithAppends = MovieDetailsResponse & MovieAppendResponses

export const movieLists = ['now_playing', 'popular', 'top_rated', 'upcoming', 'trending'] as const
