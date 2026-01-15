<script lang="ts">
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import { cn } from '@lvigerust/utils'
	import type { Episode, Movie, Show } from '$types'
	import type { HTMLImgAttributes } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'

	// TMDB image sizes:
	// "backdrop_sizes": ["w300", "w780", "w1280", "original"]
	// "poster_sizes": ["w92", "w154", "w185", "w342", "w500", "w780", "original"]
	// "still_sizes": ["w92", "w185", "w300", "original"]

	let {
		ref = $bindable(),
		item,
		backdrop = false,
		still = false,
		alt,
		sizes,
		class: className,
		...restProps
	}: WithElementRef<HTMLImgAttributes, HTMLImageElement> & {
		item: Movie | Show | Episode
		backdrop?: boolean
		still?: boolean
	} = $props()

	const isEpisode = (item: Movie | Show | Episode): item is Episode =>
		'still_path' in item && !('media_type' in item)

	const src = $derived.by(() => {
		if (still && isEpisode(item)) return item.still_path
		if (!isEpisode(item)) {
			if (backdrop) return item.backdrop_path
			return item.poster_path
		}
		return undefined
	})

	const srcset = $derived.by(() => {
		if (still) {
			return [
				`${PUBLIC_TMDB_IMG_URL}/w92${src} 92w`,
				`${PUBLIC_TMDB_IMG_URL}/w185${src} 185w`,
				`${PUBLIC_TMDB_IMG_URL}/w300${src} 300w`,
				`${PUBLIC_TMDB_IMG_URL}/original${src} 1920w`
			].join(', ')
		}

		if (backdrop) {
			return [
				`${PUBLIC_TMDB_IMG_URL}/w300${src} 300w`,
				`${PUBLIC_TMDB_IMG_URL}/w780${src} 780w`,
				`${PUBLIC_TMDB_IMG_URL}/w1280${src} 1280w`
			].join(', ')
		}

		return [
			`${PUBLIC_TMDB_IMG_URL}/w92${src} 92w`,
			`${PUBLIC_TMDB_IMG_URL}/w154${src} 154w`,
			`${PUBLIC_TMDB_IMG_URL}/w185${src} 185w`,
			`${PUBLIC_TMDB_IMG_URL}/w342${src} 342w`,
			`${PUBLIC_TMDB_IMG_URL}/w500${src} 500w`,
			`${PUBLIC_TMDB_IMG_URL}/w780${src} 780w`
		].join(', ')
	})

	const defaultSrc = $derived.by(() => {
		if (still) return `${PUBLIC_TMDB_IMG_URL}/w300${src}`
		if (backdrop) return `${PUBLIC_TMDB_IMG_URL}/w780${src}`
		return `${PUBLIC_TMDB_IMG_URL}/w500${src}`
	})
	const defaultSizes = $derived(still ? '300px' : backdrop ? '336px' : '160px')
	const aspectRatio = $derived(still || backdrop ? 'aspect-video' : 'aspect-2/3')
	const itemName = $derived.by(() => {
		if (isEpisode(item)) return item.name
		return item.media_type === 'movie' ? item.title : item.name
	})
</script>

<img
	{...restProps}
	src={defaultSrc}
	{srcset}
	alt={alt || itemName}
	sizes={sizes || defaultSizes}
	title={itemName}
	class={cn('size-full rounded-lg object-cover', aspectRatio, className)}
	bind:this={ref} />
