import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { z } from 'zod/v4'

export const addToWatchlist = query(
	z.object({ id: z.number(), media_type: z.enum(['movie', 'tv']) }),
	async ({ id, media_type }) => {
		const { fetch, locals, cookies } = getRequestEvent()

		if (!locals.user) throw new Error('No user')

		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/account/${locals.user.id}/watchlist?session_id=${cookies.get('session_id')}`,
			{
				method: 'POST',
				body: JSON.stringify({ media_type, media_id: id, watchlist: true })
			}
		)

		return { success: res.ok }
	}
)
