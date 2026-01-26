<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { ComponentProps } from 'svelte'
	import type { Media } from '$types'
	import { Carousel, CarouselItem } from '../Carousel'
	import { MediaQuery, SvelteSet, type SvelteMap } from 'svelte/reactivity'
	import { Image, Logo } from '$components'
	import { createSlug } from '$utils'

	const mobile = new MediaQuery('width < 40rem')

	const classes = [
		// Hero Carousel styles
		'snap-always sm:[--item-width:var(--container-4xl)] [--item-width:calc(100%-5vw)] sm:[--gap:2vmin] [--gap:2.5vmin]',

		// Empty first and last slides
		'before:block after:block'
	]

	const trackSnap = (carousel: HTMLDivElement) => {
		const getIndex = (event: ScrollSnapEvent) => event.snapTargetInline?.dataset.index

		const onChanging = (event: ScrollSnapEvent) => {
			const indexStr = getIndex(event)
			if (indexStr) fetchedIndexes.add(Number(indexStr))
		}

		const onChange = (event: ScrollSnapEvent) => {
			const indexStr = getIndex(event)
			if (indexStr) startSnap = Number(indexStr)
		}

		carousel.addEventListener('scrollsnapchanging', onChanging)
		carousel.addEventListener('scrollsnapchange', onChange)

		return () => {
			carousel.removeEventListener('scrollsnapchanging', onChanging)
			carousel.removeEventListener('scrollsnapchange', onChange)
		}
	}

	let {
		items,
		startSnap = $bindable(0),
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		items: SvelteMap<number, Media>
		startSnap?: number
	} = $props()

	let fetchedIndexes = new SvelteSet<number>()

	$effect(() => {
		fetchedIndexes.add(startSnap)
	})
</script>

<Carousel
	{@attach trackSnap}
	markers={!mobile.current}
	bleed
	{...restProps}
	class={cn(classes, className)}>
	{#each items.values() as item, index (item.id)}
		<CarouselItem
			data-index={index}
			data-label={item.media_type === 'movie' ? item.title : item.name}
			href={createSlug(item)}
			class="@container-[scroll-state] snap-center">
			<figure
				class:scroll-start={index === startSnap}
				class="grid aspect-video [place-items:end_stretch] overflow-clip rounded-lg *:[grid-area:1/1]">
				<Image {item} sizes="896px" backdrop />

				{#if fetchedIndexes.has(index)}
					<figcaption class="flex h-1/3 items-end px-8 pb-6 sm:px-16 sm:pb-12">
						<Logo {item} class="logo" />
					</figcaption>
				{/if}
			</figure>
		</CarouselItem>
	{/each}
</Carousel>

<style lang="postcss">
	@reference "#app.css";

	/* Transition modifiers that are applied to the transition below */
	figure {
		@apply transition-opacity duration-500 ease-out-1;

		figcaption {
			@apply bg-linear-to-t from-zinc-950/25 transition duration-1000 ease-out-2;
			@starting-style {
				@apply opacity-0;
			}

			> :global(.logo) {
				@apply transition delay-150 duration-700 ease-2;
				@starting-style {
					@apply translate-x-4 opacity-0;
				}
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

				figcaption > :global(.logo) {
					@apply translate-x-4 opacity-0;
				}
			}
		}
	}
</style>
