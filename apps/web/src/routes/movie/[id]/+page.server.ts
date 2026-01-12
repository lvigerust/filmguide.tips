import { getMovie } from '$api'

export const load = async ({ params }) => {
	const movie = await getMovie(params.id)

	return {
		title: movie.title,
		movie
	}
}
