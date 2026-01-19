<script lang="ts">
	import { cn, slugify } from '@lvigerust/utils'
	import { Carousel, CarouselItem } from '../Carousel'
	import { Heading } from '@lvigerust/components/Heading'
	import { resolve } from '$app/paths'
	import { Image } from '$components'
	import type { ComponentProps } from 'svelte'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { ClassValue } from 'svelte/elements'
	import type { Media } from '$types'

	const trackClick = (itemNode: HTMLDivElement) => {
		const handler = (event: Event & { currentTarget: HTMLElement }) => {
			const item = event.currentTarget.dataset.id
			event.currentTarget.style.setProperty('view-transition-name', `poster-${item}`)
		}
		itemNode.addEventListener('click', handler as EventListener)
		return () => itemNode.removeEventListener('click', handler as EventListener)
	}

	let {
		heading,
		items,
		startIndex = 0,
		backdrop = false,
		containerClass,
		class: className,
		...restProps
	}: ComponentProps<typeof Carousel> & {
		heading: string
		items: SvelteMap<number, Media>
		startIndex?: number
		backdrop?: boolean
		containerClass?: ClassValue
	} = $props()
</script>

<div class={cn('relative [--gutter:--spacing(4)] sm:[--gutter:--spacing(20)]', containerClass)}>
	<Heading class="mb-2 px-(--gutter) text-lg sm:mb-4">
		{heading}
	</Heading>

	<Carousel
		{...restProps}
		style="container-type: scroll-state;"
		class={cn('poster-carousel scroll-px-(--gutter) px-(--gutter)', className)}>
		{#each items.values() as item, index (item.id)}
			<CarouselItem
				{@attach trackClick}
				data-vt
				data-id={item.id}
				href={resolve(
					`/${item.media_type}/${item.id}-${slugify((item.media_type === 'movie' ? item.title : item.name) ?? '')}`
				)}
				class={[
					'snap-start transition-transform duration-200 ease-out-1 hover:-translate-y-0.5 max-sm:rounded-md',
					backdrop
						? 'max-w-[55cqi] sm:max-w-84'
						: 'max-w-[calc((100cqi-var(--gutter)*2-(--spacing(2.5)*3))/3)] sm:max-w-40',
					index === startIndex && 'scroll-start'
				]}>
				<div class="carousel__item-poster rounded-md sm:rounded-lg">
					<Image {item} {backdrop} />
				</div>
			</CarouselItem>
		{/each}
	</Carousel>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	@supports (animation-timeline: view()) {
		.carousel__item-poster {
			animation: animate-out linear forwards;
			animation-timeline: view(inline);
			animation-range: exit;
		}
	}

	@keyframes animate-out {
		to {
			opacity: 0.5;
			scale: 0.95;
		}
	}

	/* @supports (container-type: scroll-state) {
		:global(.poster-carousel) {
			&::before {
				@apply pointer-events-none absolute top-2 right-10 z-10 rounded bg-zinc-800/60 px-2 py-1 text-xs text-white;
			}

			@container scroll-state((scrollable: inline-start) and (scrollable: inline-end)) {
				&::before {
					content: 'both directions';
				}
			}

			@container scroll-state((scrollable: inline-end) and (not (scrollable: inline-start))) {
				&::before {
					content: 'at start';
				}
			}

			@container scroll-state((scrollable: inline-start) and (not (scrollable: inline-end))) {
				&::before {
					content: 'at end';
				}
			}
		}
	} */
</style>
