<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'

	let {
		heading,
		items,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & { heading: string; items: (Movie | Show)[] } = $props()
</script>

<div class="full-bleed [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<Heading class="mb-4 px-(--gutter) text-lg">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		class={cn(
			'carousel carousel--scroll-buttons carousel--scroll-markers scroll-px-(--gutter) px-(--gutter)',
			className
		)}>
		{#each items as item (item.id)}
			{@const title = 'title' in item ? item.title : item.name}
			<CarouselItem class="max-w-38">
				<a href={resolve(`/movie/${item.id}`)}>
					<Image path={item.poster_path} alt={title} class="aspect-2/3 object-cover" />
				</a>
			</CarouselItem>
		{/each}
	</Carousel>
</div>
