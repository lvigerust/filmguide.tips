import { PUBLIC_TMDB_BASE_URL } from '$env/static/public'
import type { Response } from '$types'
import { redirect } from '@sveltejs/kit'
import { safeRedirect } from '$lib/utils'

export const GET = async ({ fetch, url }) => {
	const res = await fetch(`${PUBLIC_TMDB_BASE_URL}/authentication/token/new`)

	if (!res.ok) throw new Error(res.statusText)

	const data: Response<'authentication-create-request-token'> = await res.json()

	if (!data.request_token) throw new Error('No request token')

	const redirectUrl = new URL('/api/auth/callback', url.origin)
	redirectUrl.searchParams.set('redirectTo', safeRedirect(url.searchParams.get('redirectTo')))

	const approveUrl = new URL(`/authenticate/${data.request_token}`, 'https://www.themoviedb.org')
	approveUrl.searchParams.set('redirect_to', String(redirectUrl))

	redirect(302, approveUrl)
}
