<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Movie, Show } from '$types'
	import { Carousel, CarouselItem } from './Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { TextLink } from '@lvigerust/components/Text'
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

<div class="full-bleed [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<div class="mb-4 flex items-end justify-between px-(--gutter)">
		<Heading class="text-lg">
			{heading}
		</Heading>
		<TextLink href="/movie" class="not-hover:no-underline dark:text-zinc-400">See all</TextLink>
	</div>

	<Carousel {...restProps} class={cn('scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item (item.id)}
			<CarouselItem class="group relative max-w-80">
				<a href={resolve(`/movie/${item.id}`)}>
					<figure>
						<Image
							path={item.backdrop_path}
							alt={item.media_type === 'movie' ? item.title : item.name}
							class="aspect-video object-cover" />

						<figcaption class="absolute inset-0 flex items-end">
							<div
								class="flex w-full bg-linear-to-b to-black p-6 opacity-0 transition-opacity group-hover:opacity-100">
								<Heading level={3} class="text-xl"
									>{item.media_type === 'movie' ? item.title : item.name}</Heading>
							</div>
						</figcaption>
					</figure>
				</a>
			</CarouselItem>
		{/each}
	</Carousel>
</div>
