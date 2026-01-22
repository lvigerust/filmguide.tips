import type { Response, ResultItem } from '$types'

// Raw API response types (internal use)
export type ShowListResponse = Response<'tv-series-popular-list'>
export type ShowListItemResponse = ResultItem<'tv-series-popular-list'>
export type ShowDetailsResponse = Response<'tv-series-details'>

// Standalone endpoint types
export type ShowSeasonDetails = Response<'tv-season-details'>
export type ShowEpisodeDetails = Response<'tv-episode-details'>
export type ShowImages = Response<'tv-series-images'>
export type ShowWatchProviders = Response<'tv-series-watch-providers'>
export type TrendingShowResponse = Response<'trending-tv'>

export type Episode = NonNullable<ShowSeasonDetails['episodes']>[number]

// Public types with media_type discriminator
export type Show = ShowListItemResponse & { media_type: 'tv' }
export type ShowDetails = ShowDetailsResponse & { media_type: 'tv' }

// Append to response options
export const append_show_options = [
	'videos',
	'credits',
	'aggregate_credits',
	'images',
	'keywords',
	'reviews',
	'similar',
	'recommendations',
	'external_ids',
	'alternative_titles',
	'content_ratings',
	'episode_groups',
	'translations',
	'watch/providers',
	'account_states',
	'changes',
	'screened_theatrically'
] as const

export type ShowAppendToResponse = (typeof append_show_options)[number]

export type ShowAppendResponses = {
	videos?: Response<'tv-series-videos'>
	credits?: Response<'tv-series-credits'>
	aggregate_credits?: Response<'tv-series-aggregate-credits'>
	images?: ShowImages
	keywords?: Response<'tv-series-keywords'>
	reviews?: Response<'tv-series-reviews'>
	similar?: Response<'tv-series-similar'>
	recommendations?: Response<'tv-series-recommendations'>
	external_ids?: Response<'tv-series-external-ids'>
	alternative_titles?: Response<'tv-series-alternative-titles'>
	content_ratings?: Response<'tv-series-content-ratings'>
	episode_groups?: Response<'tv-series-episode-groups'>
	translations?: Response<'tv-series-translations'>
	'watch/providers'?: ShowWatchProviders
	account_states?: Response<'tv-series-account-states'>
	changes?: Response<'tv-series-changes'>
	screened_theatrically?: Response<'tv-series-screened-theatrically'>
}

export type ShowDetailsWithAppends = ShowDetailsResponse & ShowAppendResponses

export const showLists = ['airing_today', 'on_the_air', 'popular', 'top_rated', 'trending'] as const
