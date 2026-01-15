<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import type { SvelteMap } from 'svelte/reactivity'
	import { Image, Logo } from '$components'
	import { resolve } from '$app/paths'

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
			data-id={item.id}
			href={resolve(
				`/${item.media_type}/${item.id}-${slugify(item.media_type === 'movie' ? item.title : item.name)}`
			)}
			class="relative max-w-[85%] snap-center sm:max-w-4xl sm:rounded-2xl">
			<figure class:scroll-start={i === 1} class="opacity-75 transition-opacity duration-300">
				<Image {item} sizes="896px" backdrop />

				{#if snappedId === String(item.id)}
					<div class="absolute inset-x-0 bottom-0 p-12">
						<Logo {item} />
					</div>
				{/if}
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
