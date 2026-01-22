import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { cookiesConfig } from '$lib/config'
import type { Response } from '$types'
import type { RequestEvent } from '@sveltejs/kit'
import { userCache } from './cache'

const CACHE_TTL_SECONDS = 300 // 5 minutes

export const getUser = async (event: RequestEvent) => {
	const { fetch, cookies } = event

	const session_id = cookies.get('session_id')

	if (!session_id) return null

	// Check cache first
	const cached = await userCache.get(session_id)
	if (cached) return cached

	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/account?session_id=${session_id}`)

	if (!res.ok) throw new Error(res.statusText)

	const data: Response<'account-details'> = await res.json()

	cookies.set('account_id', String(data.id), { ...cookiesConfig, maxAge: 60 * 60 * 24 * 90 })

	// Cache the result
	await userCache.set(session_id, data, CACHE_TTL_SECONDS)

	return data
}
