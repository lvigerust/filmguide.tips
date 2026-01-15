<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'
	import type { SvelteMap } from 'svelte/reactivity'

	let {
		heading,
		items,
		backdrop = false,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Movie | Show>
		backdrop?: boolean
	} = $props()
</script>

<div class="[--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		class={cn('poster-carousel scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item (item.id)}
			<CarouselItem
				href={resolve(`/${item.media_type}/${item.id}`)}
				class={backdrop ? 'max-w-84' : 'max-w-40'}>
				<Image {item} {backdrop} />
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.poster-carousel > .carousel__item) {
		--start-opacity: 0.5;
		--start-scale: 0.95;
		--end: 1;
		container-type: scroll-state;
		animation: carousel-item--visibility linear both;
		animation-timeline: view(inline);
	}

	@keyframes carousel-item--visibility {
		entry 0% {
			opacity: var(--start-opacity);
			scale: var(--start-scale);
		}
		contain 0% {
			opacity: var(--end);
			scale: var(--end);
		}
		contain 100% {
			opacity: var(--end);
			scale: var(--end);
		}
		exit 100% {
			opacity: var(--start-opacity);
			scale: var(--start-scale);
		}
	}
</style>
