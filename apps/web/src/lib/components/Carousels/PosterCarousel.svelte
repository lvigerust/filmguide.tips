<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { ClassValue } from 'svelte/elements'
	import type { Media } from '$types'

	let {
		heading,
		items,
		backdrop = false,
		containerClass,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Media>
		backdrop?: boolean
		containerClass?: ClassValue
	} = $props()
</script>

<div class={cn('[--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]', containerClass)}>
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel {...restProps} class={cn('scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item (item.id)}
			<CarouselItem
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class={[
					'carousel__item-poster transition-transform duration-200 ease-out-1 hover:-translate-y-0.5',
					backdrop ? 'max-w-84' : 'max-w-40'
				]}>
				<Image {item} {backdrop} />
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.carousel__item-poster) {
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
</style>
