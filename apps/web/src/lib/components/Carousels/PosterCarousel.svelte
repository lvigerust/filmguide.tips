<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'
	import type { ComponentProps } from 'svelte'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { ClassValue } from 'svelte/elements'
	import type { Media } from '$types'

	let {
		heading,
		items,
		startIndex = 0,
		backdrop = false,
		containerClass,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Media>
		startIndex?: number
		backdrop?: boolean
		containerClass?: ClassValue
	} = $props()
</script>

<div class={cn('relative [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]', containerClass)}>
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		style="container-type: scroll-state;"
		class={cn('poster-carousel scroll-px-(--gutter) px-(--gutter) max-sm:gap-2.5', className)}>
		{#each items.values() as item, index (item.id)}
			<CarouselItem
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class={[
					'transition-transform duration-200 ease-out-1 hover:-translate-y-0.5 max-sm:rounded-md',
					backdrop
						? 'max-w-84'
						: 'max-w-[calc((100cqi-var(--gutter)*2-(--spacing(2.5)*3))/3)] sm:max-w-40',
					index === startIndex && 'scroll-start'
				]}>
				<div class="carousel__item-poster">
					<Image {item} {backdrop} />
				</div>
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.carousel__item-poster {
		animation:
			animate-in linear forwards,
			animate-out linear forwards;
		animation-timeline: view(inline);
		animation-range:
			entry -100% entry 0%,
			exit;
	}

	@keyframes animate-in {
		0% {
			opacity: 0.5;
			scale: 0.95;
		}
		100% {
			opacity: 1;
			scale: 1;
		}
	}

	@keyframes animate-out {
		0% {
			opacity: 1;
			scale: 1;
		}
		100% {
			opacity: 0.5;
			scale: 0.95;
		}
	}

	/* @supports (container-type: scroll-state) {
		:global(.poster-carousel) {
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
