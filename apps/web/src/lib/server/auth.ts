import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { cookiesConfig } from '$lib/config'
import type { Response } from '$types'
import type { RequestEvent } from '@sveltejs/kit'
import { accountCache } from './cache'

const CACHE_TTL_SECONDS = 300 // 5 minutes

export const getAccountDetails = async (event: RequestEvent) => {
	const { fetch, cookies } = event

	const session_id = cookies.get('session_id')

	if (!session_id) return null

	// Check cache first
	const cached = await accountCache.get(session_id)
	if (cached) return cached

	const accountResponse = await fetch(`${PUBLIC_TMDB_BASE_URL}/account?session_id=${session_id}`)

	if (!accountResponse.ok) throw new Error(accountResponse.statusText)

	const accountData: Response<'account-details'> = await accountResponse.json()

	cookies.set('account_id', String(accountData.id), { ...cookiesConfig, maxAge: 60 * 60 * 24 * 90 })

	// Cache the result
	await accountCache.set(session_id, accountData, CACHE_TTL_SECONDS)

	return accountData
}
