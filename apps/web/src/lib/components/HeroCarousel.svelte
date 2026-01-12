<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import { Heading } from '@lvigerust/components/Heading'

	let {
		items,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & { items: (Movie | Show)[] } = $props()
</script>

<Carousel {...restProps} class={cn('full-bleed hero__carousel snap-always sm:gap-x-8', className)}>
	{#each items as item, i (item.id)}
		{@const title = 'title' in item ? item.title : item.name}
		<CarouselItem class="relative max-w-[85%] snap-center sm:max-w-4xl sm:rounded-2xl">
			<figure class:scroll-start={i === 1}>
				<picture>
					<img
						src={`https://image.tmdb.org/t/p/w1280/${item.backdrop_path}`}
						alt={title}
						class="aspect-video object-cover" />
				</picture>

				<figcaption
					class="absolute inset-0 flex translate-y-40 items-end transition-transform duration-500 ease-in-out">
					<div class="flex w-full bg-linear-to-b to-black p-6 sm:px-10 sm:py-12">
						<Heading level={3} class="text-xl">{title}</Heading>
					</div>
				</figcaption>
			</figure>
		</CarouselItem>
	{/each}
</Carousel>

<style lang="postcss">
	@reference "tailwindcss";

	@container scroll-state(snapped: inline) {
		figcaption {
			@apply translate-y-0;
		}
	}
</style>
