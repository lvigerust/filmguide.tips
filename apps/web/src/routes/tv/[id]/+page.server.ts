import { getTvShow, getTvShowSeasons } from '$api'

export const load = async ({ params }) => {
	const show = await getTvShow(params.id)

	const seasons = await getTvShowSeasons({
		id: String(show.id),
		numberOfSeasons: show.number_of_seasons
	})

	return {
		title: show.name,
		show,
		seasons
	}
}
