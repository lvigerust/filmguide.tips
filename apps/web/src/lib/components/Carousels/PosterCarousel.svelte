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

<div class={cn('slide-up [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]', containerClass)}>
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel {...restProps} class={cn('scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item (item.id)}
			<CarouselItem
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class={['appear', backdrop ? 'max-w-84' : 'max-w-40']}>
				<Image {item} {backdrop} />
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.slide-up) {
		animation: carousel--slide-up linear forwards;
		animation-timeline: view();
		animation-range: entry 0px entry calc((--spacing(40) / (2 / 3) / 1.5));
	}

	:global(.appear) {
		--start-opacity: 0.5;
		--start-scale: 0.95;
		--end: 1;
		container-type: scroll-state;
		animation: carousel-item--appear linear both;
		animation-timeline: view(inline);
	}

	@keyframes carousel--slide-up {
		from {
			opacity: 0;
			translate: 0 --spacing(5);
		}
	}

	@keyframes carousel-item--appear {
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
