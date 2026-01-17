<script lang="ts">
	import { getMovieImages } from '$api/movie.remote'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import type { Movie, Show } from '$types'
	import { cn } from '@lvigerust/utils'
	import { untrack } from 'svelte'
	import type { HTMLImgAttributes } from 'svelte/elements'

	let {
		item,
		class: className,
		...restProps
	}: HTMLImgAttributes & { item: Movie | Show } = $props()

	const images = await untrack(() => getMovieImages({ id: item.id, media_type: item.media_type }))
</script>

<img
	{...restProps}
	src={`${PUBLIC_TMDB_IMG_URL}/w500${images.logos?.[0].file_path}`}
	alt="Logo"
	class={cn('max-h-40 max-w-1/3 object-contain', className)} />
