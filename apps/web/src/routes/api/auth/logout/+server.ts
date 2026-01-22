import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import { cookiesConfig } from '$lib/config.js'
import { redirect } from '@sveltejs/kit'

export const GET = async ({ fetch, cookies }) => {
	const session_id = cookies.get('session_id')

	if (!session_id) redirect(303, '/')

	const response = await fetch(`${PUBLIC_TMDB_BASE_URL}/authentication/session`, {
		method: 'DELETE',
		body: JSON.stringify({ session_id })
	})

	if (!response.ok) throw new Error(response.statusText)

	cookies.delete('session_id', cookiesConfig)
	cookies.delete('account_id', cookiesConfig)

	redirect(303, '/')
}
