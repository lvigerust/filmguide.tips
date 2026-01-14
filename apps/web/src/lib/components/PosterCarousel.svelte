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
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Movie | Show>
	} = $props()
</script>

<div class="[--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		class={cn(
			'carousel carousel--scroll-buttons carousel--scroll-markers scroll-px-(--gutter) px-(--gutter)',
			className
		)}>
		{#each items.values() as item (item.id)}
			{@const title = 'title' in item ? item.title : item.name}
			<CarouselItem class="poster-carousel__item max-w-38">
				<a href={resolve(`/movie/${item.id}`)}>
					<Image path={item.poster_path} alt={title} class="aspect-2/3 object-cover" />
				</a>
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	:global(.poster-carousel__item) {
		animation:
			poster-enter linear both,
			poster-exit linear both;
		animation-timeline: view(x);
		animation-range:
			entry 0% entry 100%,
			exit 0% exit 100%;
	}

	@keyframes poster-enter {
		from {
			opacity: 0.25;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes poster-exit {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.25;
		}
	}
</style>
