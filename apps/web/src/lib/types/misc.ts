export interface Page<T> {
	dates: {
		maximum: Date
		minimum: Date
	}
	page: number
	results: T[]
	total_pages: number
	total_results: number
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

export interface Network {
	headquarters: string
	homepage: string
	id: number
	logo_path: string
	name: string
	origin_country: string
}
