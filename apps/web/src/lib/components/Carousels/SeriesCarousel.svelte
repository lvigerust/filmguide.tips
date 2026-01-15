<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { TvSeasonDetails } from '$types'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Subheading } from '@lvigerust/components/Heading'
	import type { SvelteMap } from 'svelte/reactivity'

	let {
		seasons,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		seasons: SvelteMap<number, TvSeasonDetails>
	} = $props()
</script>

<div class="carousel__container [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<Carousel
		{...restProps}
		class={cn('poster-carousel scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each seasons.values() as season (season._id)}
			{#each season.episodes as episode (episode.id)}
				<CarouselItem class="w-40">
					<div>
						<Subheading>Episde {episode.episode_number} - {episode.name}</Subheading>
					</div>

					<!-- <Image {item} {backdrop} /> -->
				</CarouselItem>
			{/each}
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
