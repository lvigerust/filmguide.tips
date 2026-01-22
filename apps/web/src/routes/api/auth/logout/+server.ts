import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { cookiesConfig } from '$lib/config.js'
import { safeRedirect } from '$lib/utils'
import { userSessionCache } from '$lib/server/cache/session-cache'

export const GET = async ({ fetch, cookies, url }) => {
	const session_id = cookies.get('session_id')
	const redirectTo = url.searchParams.get('redirectTo')

	if (!session_id) safeRedirect(303, redirectTo)

	const response = await fetch(`${PUBLIC_TMDB_BASE_URL}/authentication/session`, {
		method: 'DELETE',
		body: JSON.stringify({ session_id })
	})

	if (!response.ok) throw new Error(response.statusText)

	cookies.delete('session_id', cookiesConfig)
	cookies.delete('account_id', cookiesConfig)

	// Clean up cached session data from Redis
	await userSessionCache.delete(session_id)

	safeRedirect(303, redirectTo)
}
