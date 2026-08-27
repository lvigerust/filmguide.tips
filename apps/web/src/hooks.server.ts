import { TMDB_API_KEY } from '$app/env/private'
import { PUBLIC_TMDB_BASE_URL } from '$app/env/public'
import { getUser } from '#lib/server/auth/auth.js'
import { handleHttpCacheRequest } from '#lib/server/cache/index.js'

export const handleFetch = async ({ fetch, request }) => {
	if (request.url.startsWith(PUBLIC_TMDB_BASE_URL)) {
		request.headers.set('accept', 'application/json')
		request.headers.set('content-type', 'application/json')
		request.headers.set('Authorization', `Bearer ${TMDB_API_KEY}`)

		return handleHttpCacheRequest(request, fetch)
	}

	return fetch(request)
}

export const handle = async ({ event, resolve }) => {
	const { locals } = event

	locals.user = await getUser(event)

	return resolve(event)
}
