<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { ClassValue } from 'svelte/elements'

	let {
		heading,
		items,
		backdrop = false,
		containerClass,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Movie | Show>
		backdrop?: boolean
		containerClass?: ClassValue
	} = $props()
</script>

<div
	class={cn(
		'carousel__container [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]',
		containerClass
	)}>
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		class={cn('poster-carousel scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item (item.id)}
			<CarouselItem
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class={backdrop ? 'max-w-84' : 'max-w-40'}>
				<Image {item} {backdrop} />
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.carousel__container) {
		animation: carousel--enter-view linear both;
		animation-timeline: view();
		animation-range: 0vh 20vh;
	}

	:global(.poster-carousel > .carousel__item) {
		--start-opacity: 0.5;
		--start-scale: 0.95;
		--end: 1;
		container-type: scroll-state;
		animation: carousel-item--visibility linear both;
		animation-timeline: view(inline);
	}

	@keyframes carousel--enter-view {
		from {
			opacity: 0;
			translate: 0 --spacing(5);
		}
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
