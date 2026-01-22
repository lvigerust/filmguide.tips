<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { Image } from '$components'
	import type { ComponentProps } from 'svelte'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { ClassValue } from 'svelte/elements'
	import type { Media } from '$types'
	import { createSlug } from '$utils'

	let {
		heading,
		items,
		startIndex = 0,
		backdrop = false,
		class: className,
		containerClass,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Media>
		startIndex?: number
		backdrop?: boolean
		containerClass?: ClassValue
	} = $props()
</script>

<div class={cn('carousel-wrapper relative full-bleed', containerClass)}>
	<Heading class="mb-2 px-(--carousel-padding) text-lg sm:mb-4">
		{heading}
	</Heading>

	<div class="poster-carousel contents">
		<Carousel
			bleed
			{...restProps}
			class={cn('auto-cols-[--spacing(38)]', backdrop && 'auto-cols-[--spacing(80)]', className)}>
			{#each items.values() as item, index (item.id)}
				<CarouselItem
					data-id={item.id}
					href={createSlug(item)}
					class={['poster snap-start', index === startIndex && 'scroll-start']}>
					<Image {item} {backdrop} />
				</CarouselItem>
			{/each}
		</Carousel>
	</div>
</div>

<style lang="postcss">
	@reference "#app.css";

	@supports (animation-timeline: view()) {
		.carousel-wrapper {
			animation: slide-fade-in linear forwards;
			animation-timeline: view();
			animation-range: cover 0% cover 25dvh;
		}
	}

	@keyframes slide-fade-in {
		from {
			opacity: 0.5;
			transform: translateY(2.5vh);
		}
	}

	/* @supports (container-type: scroll-state) {
		:global(.poster-carousel > .carousel) {
			@apply @container-[scroll-state];

			&::before {
				@apply pointer-events-none absolute top-2 right-10 z-10 rounded bg-zinc-800/60 px-2 py-1 text-xs text-white;
			}

			@container scroll-state((scrollable: inline-start) and (scrollable: inline-end)) {
				&::before {
					content: 'both directions';
				}
			}

			@container scroll-state((scrollable: inline-end) and (not (scrollable: inline-start))) {
				&::before {
					content: 'at start';
				}
			}

			@container scroll-state((scrollable: inline-start) and (not (scrollable: inline-end))) {
				&::before {
					content: 'at end';
				}
			}
		}
	} */
</style>
