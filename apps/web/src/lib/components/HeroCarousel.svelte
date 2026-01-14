<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import type { SvelteMap } from 'svelte/reactivity'
	import { Logo } from '$components'

	let snappedId = $state<string>()

	let {
		items,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & { items: SvelteMap<number, Movie | Show> } = $props()

	let ref = $state<HTMLDivElement>()

	$effect(() => {
		const carousel = ref
		if (!carousel) return

		const handleSnapChange = (e: Event) => {
			// @ts-expect-error SnapEvent
			const element: HTMLElement = e.snapTargetInline
			snappedId = element.dataset.id ?? '1'
		}

		carousel.addEventListener('scrollsnapchange', handleSnapChange)

		return () => {
			carousel.removeEventListener('scrollsnapchange', handleSnapChange)
		}
	})
</script>

<Carousel
	bind:ref
	{...restProps}
	class={cn('hero__carousel full-bleed snap-always sm:gap-x-8', className)}>
	{#each items.values() as item, i (item.id)}
		<CarouselItem
			class="relative max-w-[85%] snap-center sm:max-w-4xl sm:rounded-2xl"
			data-id={item.id}>
			<figure class:scroll-start={i === 1} class="opacity-75 transition-opacity duration-300">
				<picture>
					<img
						src={`https://image.tmdb.org/t/p/w1280/${item.backdrop_path}`}
						alt={item.media_type === 'movie' ? item.title : item.name}
						class="aspect-video object-cover" />
				</picture>

				<div class="absolute inset-x-0 bottom-0">
					{#if snappedId === String(item.id)}
						<Logo {item} />
					{/if}
				</div>
			</figure>
		</CarouselItem>
	{/each}
</Carousel>

<style lang="postcss">
	@reference "tailwindcss";

	@container scroll-state(snapped: inline) {
		figure {
			@apply opacity-100;
		}
	}

	:global(.hero__carousel) {
		&::before,
		&::after {
			content: '';
			display: block;
			inline-size: 50cqi;
			flex-shrink: 0;
		}
	}
</style>
