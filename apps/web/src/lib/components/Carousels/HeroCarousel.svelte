<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from '../Carousel'
	import type { SvelteMap } from 'svelte/reactivity'
	import { Image, Logo } from '$components'
	import { resolve } from '$app/paths'

	let {
		items,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & { items: SvelteMap<number, Movie | Show> } = $props()

	let ref = $state<HTMLDivElement>()
</script>

<div class="hero-carousel contents">
	<Carousel
		bind:ref
		{...restProps}
		data-hero-carousel
		class={cn('full-bleed snap-always sm:gap-x-8', className)}>
		{#each items.values() as item, i (item.id)}
			<CarouselItem
				data-id={item.id}
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class="relative max-w-[85%] snap-center sm:max-w-4xl sm:rounded-2xl">
				<figure
					class:scroll-start={i === 3}
					class="grid aspect-video [place-items:end_stretch] overflow-clip rounded-lg *:[grid-area:1/1]">
					<Image {item} sizes="896px" backdrop />

					<figcaption class="px-16 pb-12">
						<Logo {item} />
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
				@apply transition delay-300 duration-1000 ease-out-3;
			}
		}

		/* Unsnapped items */
		@container not scroll-state(snapped: inline) {
			figure {
				@apply opacity-75;

				figcaption {
					@apply translate-x-8 opacity-0;
				}
			}
		}

		&::before,
		&::after {
			content: '';
			display: block;
			inline-size: 50cqi;
			flex-shrink: 0;
		}
	}
</style>
