<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import { untrack, type ComponentProps } from 'svelte'
	import type { Media } from '$types'
	import { Carousel, CarouselItem } from '../Carousel'
	import { MediaQuery, SvelteSet, type SvelteMap } from 'svelte/reactivity'
	import { Image, Logo } from '$components'
	import { resolve } from '$app/paths'
	import { fly } from 'svelte/transition'
	import { quadOut } from 'svelte/easing'

	let mobile = new MediaQuery('width < 64rem')

	let {
		items,
		startIndex = mobile.current ? 0 : 1,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		items: SvelteMap<number, Media>
		startIndex?: number
	} = $props()

	let fetchedIndexes = untrack(() => new SvelteSet([startIndex])) // Initial index

	const trackSnap = (carousel: HTMLDivElement) => {
		const handler = (event: Event & { snapTargetInline: HTMLElement | null }) => {
			const element = event.snapTargetInline
			const indexStr = element?.dataset.index
			if (indexStr) fetchedIndexes.add(Number(indexStr))
		}

		carousel.addEventListener('scrollsnapchanging', handler as EventListener)
		return () => carousel.removeEventListener('scrollsnapchanging', handler as EventListener)
	}
</script>

<div class="hero-carousel contents">
	<Carousel
		{@attach trackSnap}
		{...restProps}
		class={cn('full-bleed snap-always sm:gap-x-8', className)}>
		{#each items.values() as item, index (item.id)}
			<CarouselItem
				data-index={index}
				data-id={item.id}
				style="container-type: scroll-state;"
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class="relative max-w-[85%] snap-center sm:max-w-4xl sm:rounded-2xl">
				<figure
					class:scroll-start={index === [...fetchedIndexes][0]}
					class="grid aspect-video [place-items:end_stretch] overflow-clip rounded-lg *:[grid-area:1/1]">
					<Image {item} sizes="896px" backdrop />

					<figcaption class="flex h-1/3 items-end px-8 pb-6 sm:px-16 sm:pb-12">
						{#if fetchedIndexes.has(index)}
							<div
								in:fly={{
									x: 32,
									duration: 1000,
									delay: 300,
									easing: quadOut
								}}
								class="logo w-full">
								<Logo {item} />
							</div>
						{/if}
					</figcaption>
				</figure>
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.hero-carousel {
		/* Transition modifiers that are applied to the transition below */
		figure {
			@apply transition-opacity duration-500;

			figcaption {
				@apply bg-linear-to-t from-zinc-950/25 transition-colors duration-1000 ease-out-2;

				> .logo {
					@apply transition delay-300 duration-1000 ease-out-3;
				}
			}
		}

		@supports (container-type: scroll-state) {
			/* Snapped items */
			@container scroll-state(snapped: inline) {
				figcaption {
					@apply opacity-100;
				}
			}
			/* Unsnapped items */
			@container not scroll-state(snapped: inline) {
				figure {
					@apply opacity-75;

					figcaption > .logo {
						@apply translate-x-8 opacity-0;
					}
				}
			}
		}
	}

	:global(.hero-carousel > .carousel) {
		&::before,
		&::after {
			content: '';
			display: block;
			inline-size: 50cqi;
			flex-shrink: 0;
		}
	}
</style>
