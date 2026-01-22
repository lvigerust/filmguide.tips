<script lang="ts">
	import { getMediaImages } from '$api/images.remote'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import type { Media } from '$types'
	import { cn } from '@lvigerust/utils'
	import { untrack } from 'svelte'
	import type { HTMLImgAttributes } from 'svelte/elements'

	let { item, class: className, ...restProps }: HTMLImgAttributes & { item: Media } = $props()

	const images = await untrack(() => getMediaImages({ id: item.id, media_type: item.media_type }))
</script>

{#if images.logos?.length}
	<enhanced:img
		{...restProps}
		src={`${PUBLIC_TMDB_IMG_URL}/w500${images.logos[0].file_path}`}
		alt="Logo"
		class={cn('max-h-40 max-w-1/3 object-contain', className)} />
{/if}
