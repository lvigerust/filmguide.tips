import { TMDB_API_KEY } from '$env/static/private'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { getAccountDetails } from '$lib/server/auth'
import { handleCachedRequest } from '$lib/server/etag-cache'

export const handleFetch = async ({ fetch, request }) => {
	if (request.url.startsWith(PUBLIC_TMDB_BASE_URL)) {
		request.headers.set('accept', 'application/json')
		request.headers.set('content-type', 'application/json')
		request.headers.set('Authorization', `Bearer ${TMDB_API_KEY}`)

		return handleCachedRequest(request, fetch)
	}

	return fetch(request)
}

export const handle = async ({ event, resolve }) => {
	const { locals } = event

	locals.account = await getAccountDetails(event)

	return resolve(event)
}
