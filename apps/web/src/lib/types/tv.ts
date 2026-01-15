import type { Network } from '$types'

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

export interface Season {
	_id: string
	air_date: Date
	episodes: Episode[]
	name: string
	networks: Omit<Network, 'headquarters' | 'homepage'>[]
	overview: string
	id: number
	poster_path: string
	season_number: number
	vote_average: number
}

export interface Episode {
	air_date: Date
	episode_number: number
	episode_type: string
	id: number
	name: string
	overview: string
	production_code: string
	runtime: number
	season_number: number
	show_id: number
	still_path: string
	vote_average: number
	vote_count: number
	crew: Crew[]
	guest_stars: Crew[]
}

export interface Crew {
	department?: string
	job?: string
	credit_id: string
	adult: boolean
	gender: number
	id: number
	known_for_department: string
	name: string
	original_name: string
	popularity: number
	profile_path: null | string
	character?: string
	order?: number
}
