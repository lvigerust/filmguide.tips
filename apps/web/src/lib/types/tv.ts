import type { Response, ResultItem } from '$types'

// TV types (raw from API)
export type TvListResponse = Response<'tv-series-popular-list'>
export type TvListItem = ResultItem<'tv-series-popular-list'>
export type TvDetails = Response<'tv-series-details'>
export type TvImages = Response<'tv-series-images'>
export type TvSeasonDetails = Response<'tv-season-details'>
export type TvEpisodeDetails = Response<'tv-episode-details'>
export type TvWatchProviders = Response<'tv-series-watch-providers'>

export type TrendingTvResponse = Response<'trending-tv'>

export type Episode = NonNullable<TvSeasonDetails['episodes']>[number]

export type Show = (TvListItem | TvDetails) & { media_type: 'tv' }
