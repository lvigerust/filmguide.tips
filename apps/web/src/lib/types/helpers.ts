import type { operations } from './tmdb'
import type { Movie, MovieImages, MovieWatchProviders } from './movie'
import type { Show, TvImages, TvWatchProviders } from './tv'

/**
 * Extracts the JSON response type from an operation
 */
export type Response<T extends keyof operations> =
	operations[T]['responses'][200]['content']['application/json']

/**
 * Extracts the results array item type from a paginated response
 */
export type ResultItem<T extends keyof operations> =
	Response<T> extends { results?: (infer R)[] } ? R : never

// Discriminated union types (used in components)
export type Media = Movie | Show

// Images type (works for both movie and TV)
export type Images = MovieImages | TvImages
export type WatchProviders = MovieWatchProviders | TvWatchProviders
