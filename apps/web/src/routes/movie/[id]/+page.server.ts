import { getMovieDetails } from '$api'

export const load = async ({ params }) => {
	const movie = await getMovieDetails({ id: params.id })

	return {
		title: movie.title,
		movie
	}
}
