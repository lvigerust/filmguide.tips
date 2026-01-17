import { TMDB_API_KEY } from '$env/static/private'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'

export const handleFetch = async ({ fetch, request }) => {
	if (request.url.startsWith(PUBLIC_TMDB_BASE_URL)) {
		request.headers.set('Authorization', `Bearer ${TMDB_API_KEY ?? process.env.TMDB_API_KEY}`)
	}

	return fetch(request)
}
