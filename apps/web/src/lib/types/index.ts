export interface APIResponse<T> {
	dates: {
		maximum: Date
		minimum: Date
	}
	page: number
	results: T[]
	total_pages: number
	total_results: number
}

export interface Movie {
	media_type: 'movie'
	adult: boolean
	backdrop_path: string
	genre_ids: number[]
	id: number
	original_language: string
	original_title: string
	overview: string
	popularity: number
	poster_path: string
	release_date: Date
	title: string
	video: boolean
	vote_average: number
	vote_count: number
}

export interface Show {
	media_type: 'tv'
	backdrop_path: string
	first_air_date: Date
	genre_ids: number[]
	id: number
	name: string
	origin_country: string[]
	original_language: string
	original_name: string
	overview: string
	popularity: number
	poster_path: string
	vote_average: number
	vote_count: number
}

export interface Network {
	headquarters: string
	homepage: string
	id: number
	logo_path: string
	name: string
	origin_country: string
}

export interface Images {
	backdrops: Image[]
	id: number
	logos?: Image[]
	posters: Image[]
}

export interface Image {
	aspect_ratio: number
	height: number
	iso_639_1: null | string
	file_path: string
	vote_average: number
	vote_count: number
	width: number
}
