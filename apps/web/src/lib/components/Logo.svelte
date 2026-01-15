<script lang="ts">
	import { getMovieImages } from '$api/movie.remote'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import type { Movie, Show } from '$types'
	import { untrack } from 'svelte'
	import { cubicInOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'

	let { item }: { item: Movie | Show } = $props()

	const images = await untrack(() => getMovieImages({ id: item.id, media_type: item.media_type }))
</script>

<img
	in:fly={{ x: 15, duration: 800, easing: cubicInOut }}
	out:fly={{ x: -15, duration: 800, easing: cubicInOut }}
	src={`${PUBLIC_TMDB_IMG_URL}/w500${images.logos?.[0].file_path}`}
	alt="Logo"
	class="max-h-40 max-w-1/2 object-contain" />
