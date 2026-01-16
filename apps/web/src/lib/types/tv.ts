import type { Response, ResultItem } from '$types'

// TV types (raw from API)
export type TvListResponse = Response<'tv-series-popular-list'>
export type TvListItem = ResultItem<'tv-series-popular-list'>
export type TvDetails = Response<'tv-series-details'>
export type TvSeasonDetails = Response<'tv-season-details'>
export type TvEpisodeDetails = Response<'tv-episode-details'>

// Append response types
export type TvAccountStates = Response<'tv-series-account-states'>
export type TvAggregateCredits = Response<'tv-series-aggregate-credits'>
export type TvAlternativeTitles = Response<'tv-series-alternative-titles'>
export type TvChanges = Response<'tv-series-changes'>
export type TvContentRatings = Response<'tv-series-content-ratings'>
export type TvCredits = Response<'tv-series-credits'>
export type TvEpisodeGroups = Response<'tv-series-episode-groups'>
export type TvExternalIds = Response<'tv-series-external-ids'>
export type TvImages = Response<'tv-series-images'>
export type TvKeywords = Response<'tv-series-keywords'>
export type TvRecommendations = Response<'tv-series-recommendations'>
export type TvReviews = Response<'tv-series-reviews'>
export type TvScreenedTheatrically = Response<'tv-series-screened-theatrically'>
export type TvSimilar = Response<'tv-series-similar'>
export type TvTranslations = Response<'tv-series-translations'>
export type TvVideos = Response<'tv-series-videos'>
export type TvWatchProviders = Response<'tv-series-watch-providers'>

export type TrendingTvResponse = Response<'trending-tv'>

export type Episode = NonNullable<TvSeasonDetails['episodes']>[number]

export type Show = (TvListItem | TvDetails) & { media_type: 'tv' }

/** All possible append response properties (optional) */
export type TvAppendResponses = {
	account_states?: TvAccountStates
	aggregate_credits?: TvAggregateCredits
	alternative_titles?: TvAlternativeTitles
	changes?: TvChanges
	content_ratings?: TvContentRatings
	credits?: TvCredits
	episode_groups?: TvEpisodeGroups
	external_ids?: TvExternalIds
	images?: TvImages
	keywords?: TvKeywords
	recommendations?: TvRecommendations
	reviews?: TvReviews
	screened_theatrically?: TvScreenedTheatrically
	similar?: TvSimilar
	translations?: TvTranslations
	videos?: TvVideos
	'watch/providers'?: TvWatchProviders
}

/** TvDetails with all append options as optional properties */
export type TvDetailsWithAppends = TvDetails & TvAppendResponses

export const append_tv_options = [
	'account_states',
	'aggregate_credits',
	'alternative_titles',
	'changes',
	'content_ratings',
	'credits',
	'episode_groups',
	'external_ids',
	'images',
	'keywords',
	'recommendations',
	'reviews',
	'screened_theatrically',
	'similar',
	'translations',
	'videos',
	'watch/providers'
] as const satisfies readonly (keyof TvAppendResponses)[]
