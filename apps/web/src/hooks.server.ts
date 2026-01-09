import { TMDB_API_KEY, TMDB_BASE_URL } from '$env/static/private'

export const handleFetch = async ({ fetch, request }) => {
	if (request.url.startsWith(TMDB_BASE_URL)) {
		request.headers.set('Authorization', `Bearer ${TMDB_API_KEY}`)
	}

	return fetch(request)
}
