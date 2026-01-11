<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { TextLink } from '@lvigerust/components/Text'
	import { resolve } from '$app/paths'

	let {
		heading,
		items,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & { heading: string; items: (Movie | Show)[] } = $props()
</script>

<div class="full-bleed [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<div class="mb-4 flex items-end justify-between px-(--gutter)">
		<Heading class="text-lg">
			{heading}
		</Heading>
		<TextLink href="/movie" class="not-hover:no-underline dark:text-zinc-400">See all</TextLink>
	</div>

	<Carousel {...restProps} class={cn('scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items as item (item.id)}
			{@const title = 'title' in item ? item.title : item.name}
			<CarouselItem class="max-w-40">
				<a href={resolve(`/movie/${item.id}`)}>
					<img
						src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
						alt={title}
						class="object-cover" />
				</a>
			</CarouselItem>
		{/each}
	</Carousel>
</div>
