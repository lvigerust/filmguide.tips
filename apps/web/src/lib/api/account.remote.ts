import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { Response } from '$types'
import { z } from 'zod/v4'

export const getRequestToken = query(async () => {
	const { fetch, url } = getRequestEvent()

	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/authentication/token/new`)

	if (!res.ok) throw new Error(res.statusText)

	const data: Response<'authentication-create-request-token'> = await res.json()

	if (!data.request_token) throw new Error('No request token')

	const redirectUrl = `${url.origin}/api/auth/callback`

	const approveUrl = `https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${redirectUrl}`

	return { ...data, approveUrl }
})

export const addToWatchlist = query(
	z.object({ id: z.number(), media_type: z.enum(['movie', 'tv']) }),
	async ({ id, media_type }) => {
		const { fetch, locals, cookies } = getRequestEvent()

		if (!locals.account) throw new Error('No user')

		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/account/${locals.account.id}/watchlist?session_id=${cookies.get('session_id')}`,
			{
				method: 'POST',
				body: JSON.stringify({ media_type, media_id: id, watchlist: true })
			}
		)

		return { success: res.ok }
	}
)
