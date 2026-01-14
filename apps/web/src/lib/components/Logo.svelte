<script lang="ts">
	import { getMovieImages } from '$api/movie.remote'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import type { Movie, Show } from '$types'
	import { Heading } from '@lvigerust/components/Heading'
	import { cubicInOut } from 'svelte/easing'
	import { fade, fly } from 'svelte/transition'

	let { item }: { item: Movie | Show } = $props()

	const images = await getMovieImages({ id: item.id, media_type: item.media_type })

	type LoadingStatus = 'loading' | 'loaded' | 'error'
	let status = $state<LoadingStatus>('loading')
</script>

{#if images.logos?.length}
	<div class="p-12" out:fly={{ x: -15, duration: 800, easing: cubicInOut }}>
		{#if status === 'loaded'}
			<img
				in:fly={{ x: 15, duration: 800, easing: cubicInOut }}
				src={`${PUBLIC_TMDB_IMG_URL}/original/${images.logos[0].file_path}`}
				alt="Logo"
				class="max-h-40 max-w-1/2 object-contain" />
		{:else}
			<!-- Hidden img to trigger load event -->
			<img
				onload={() => (status = 'loaded')}
				onerror={() => (status = 'error')}
				src={`${PUBLIC_TMDB_IMG_URL}/original/${images.logos[0].file_path}`}
				alt=""
				class="hidden" />
		{/if}
	</div>
{:else}
	<div in:fade out:fade class="flex w-full bg-linear-to-b to-black p-6 sm:px-10 sm:py-12">
		<div in:fly={{ y: '100%', delay: 50 }}>
			<Heading level={3} class="text-xl">
				{item.media_type === 'movie' ? item.title : item.name}
			</Heading>
		</div>
	</div>
{/if}
