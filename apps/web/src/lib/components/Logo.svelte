<script lang="ts">
	import { getMediaImages } from '#api/images.remote.js'
	import { PUBLIC_TMDB_IMG_URL } from '$app/env/public'
	import type { Media } from '#types'
	import { cn } from '#utils'
	import type { HTMLImgAttributes } from 'svelte/elements'

	let { item, class: className, ...restProps }: HTMLImgAttributes & { item: Media } = $props()

	const images = $derived(getMediaImages({ id: item.id, media_type: item.media_type }))
</script>

{#if images.current?.logos?.length}
	<enhanced:img
		{...restProps}
		src={`${PUBLIC_TMDB_IMG_URL}/w500${images.current.logos[0].file_path}`}
		alt="Logo"
		class={cn('max-h-40 max-w-1/3 object-contain', className)}>
	</enhanced:img>
{/if}
