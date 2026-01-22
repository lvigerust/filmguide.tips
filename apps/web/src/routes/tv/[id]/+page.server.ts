import { getShowDetails, getShowSeasons } from '$api'

export const load = async ({ params }) => {
	const show = await getShowDetails({
		id: params.id,
		append: ['watch/providers', 'external_ids']
	})

	const seasons = await getShowSeasons({
		id: params.id,
		numberOfSeasons: show.number_of_seasons
	})

	return {
		title: show.name,
		show,
		seasons
	}
}
