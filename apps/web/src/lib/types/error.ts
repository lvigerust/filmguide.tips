import type { operations } from './tmdb'

/**
 * Extracts the error response type from an operation
 */
export type ErrorResponse<
	T extends keyof operations,
	S extends number = 401
> = S extends keyof operations[T]['responses']
	? operations[T]['responses'][S] extends { content: { 'application/json': infer R } }
		? R
		: never
	: never

/**
 * Generic TMDB API error response (extracted from authentication-validate-key 401)
 */
export type TmdbError = ErrorResponse<'authentication-validate-key', 401>
