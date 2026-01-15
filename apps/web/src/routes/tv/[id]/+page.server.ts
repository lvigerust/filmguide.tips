import { getTvShow } from '$api'

export const load = async ({ params }) => {
	const show = await getTvShow(params.id)

	return {
		title: show.name,
		show
	}
}
