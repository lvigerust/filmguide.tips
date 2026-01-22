import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { cookiesConfig } from '$lib/config.js'
import type { Response } from '$types'
import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, fetch, cookies }) => {
	const request_token = url.searchParams.get('request_token')
	const approved = Boolean(url.searchParams.get('approved')) || null

	if (!request_token || !approved) throw new Error('Invalid request')

	const sessionResponse = await fetch(`${PUBLIC_TMDB_BASE_URL}/authentication/session/new`, {
		method: 'POST',
		body: JSON.stringify({ request_token })
	})

	if (!sessionResponse.ok) throw new Error(sessionResponse.statusText)

	const sessionData: Response<'authentication-create-session'> = await sessionResponse.json()

	if (!sessionData.session_id || !sessionData.success) throw new Error('Session creation failed')

	cookies.set('session_id', sessionData.session_id, { ...cookiesConfig, maxAge: 60 * 60 * 24 * 90 })

	redirect(303, '/')
}
