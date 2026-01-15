import type { Response, ResultItem } from '$types'

// TV types (raw from API)
export type TvListResponse = Response<'tv-series-popular-list'>
export type TvListItem = ResultItem<'tv-series-popular-list'>
export type TvDetails = Response<'tv-series-details'>
export type TvImages = Response<'tv-series-images'>
export type TvSeasonDetails = Response<'tv-season-details'>

export type TrendingTvResponse = Response<'trending-tv'>

export type Show = (TvListItem | TvDetails) & { media_type: 'tv' }
