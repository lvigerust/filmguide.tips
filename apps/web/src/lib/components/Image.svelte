<script lang="ts">
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import { cn } from '@lvigerust/utils'
	import type { Movie, Show } from '$types'
	import type { HTMLImgAttributes } from 'svelte/elements'

	let {
		item,
		backdrop = false,
		alt,
		sizes,
		class: className,
		...restProps
	}: HTMLImgAttributes & { item: Movie | Show; backdrop?: boolean } = $props()

	const src = $derived(backdrop ? item.backdrop_path : item.poster_path)
	const srcset = $derived(
		backdrop
			? [
					`${PUBLIC_TMDB_IMG_URL}/w300${src} 300w`,
					`${PUBLIC_TMDB_IMG_URL}/w780${src} 780w`,
					`${PUBLIC_TMDB_IMG_URL}/w1280${src} 1280w`
				].join(', ')
			: [
					`${PUBLIC_TMDB_IMG_URL}/w92${src} 92w`,
					`${PUBLIC_TMDB_IMG_URL}/w154${src} 154w`,
					`${PUBLIC_TMDB_IMG_URL}/w185${src} 185w`,
					`${PUBLIC_TMDB_IMG_URL}/w342${src} 342w`,
					`${PUBLIC_TMDB_IMG_URL}/w500${src} 500w`,
					`${PUBLIC_TMDB_IMG_URL}/w780${src} 780w`
				].join(', ')
	)
</script>

<img
	{...restProps}
	src={`${PUBLIC_TMDB_IMG_URL}/${backdrop ? 'w780' : 'w500'}${src}`}
	{srcset}
	alt={alt || (item.media_type === 'movie' ? item.title : item.name)}
	sizes={sizes || (backdrop ? '336px' : '160px')}
	title={item.media_type === 'movie' ? item.title : item.name}
	class={cn('object-cover', backdrop ? 'aspect-video' : 'aspect-2/3', className)} />
