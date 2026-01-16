import type { ResultItem } from '$types'

// Search result item types (from dedicated search endpoints)
export type MovieSearchItem = ResultItem<'search-movie'> & { media_type: 'movie' }
export type TvSearchItem = ResultItem<'search-tv'> & { media_type: 'tv' }
export type PersonSearchItem = ResultItem<'search-person'> & { media_type: 'person' }

export interface MultiSearchResponse {
	page: number
	results: (MovieSearchItem | TvSearchItem | PersonSearchItem)[]
	total_pages: number
	total_results: number
}
