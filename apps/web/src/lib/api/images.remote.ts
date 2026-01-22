import { getRequestEvent, query } from '$app/server'
import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { Images } from '$types'
import { z } from 'zod/v4-mini'

export const getMediaImages = query(
	z.object({ id: z.number(), media_type: z.string() }),
	async ({ id, media_type }) => {
		const { fetch } = getRequestEvent()
		const res = await fetch(
			`${PUBLIC_TMDB_BASE_URL}/${media_type}/${id}/images?include_image_language=en-US,null`
		)
		if (!res.ok) throw new Error(res.statusText)
		const images: Images = await res.json()
		return images
	}
)
