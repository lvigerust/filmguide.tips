<script lang="ts">
	import { cn, formatDate } from '@lvigerust/utils'
	import type { TvSeasonDetails } from '$types'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import { Text } from '@lvigerust/components/Text'
	import { Subheading } from '@lvigerust/components/Heading'
	import { Icon } from '@lvigerust/components/UI'
	import { Photo } from 'svelte-heros-v2'
	import { Image } from '$components'

	let {
		seasons,
		class: className,
		...restProps
	}: SvelteHTMLElements['div'] & {
		seasons: SvelteMap<number, TvSeasonDetails>
	} = $props()
</script>

<div
	{...restProps}
	class={cn('series-carousel full-bleed', className)}
	role="region"
	aria-label="Episodes">
	<div class="carousel" aria-live="polite">
		{#each seasons.values() as season (season._id)}
			{#each season.episodes as episode, index (episode.id)}
				<di
					class="carousel__slide"
					class:season-start={index === 0}
					data-season-number={index === 0 ? season.season_number : undefined}>
					<figure
						class:opacity-50={episode.air_date &&
							new Date().getTime() < new Date(episode.air_date).getTime()}>
						{#if episode.still_path}
							<Image
								item={episode}
								still
								alt={episode.name || `Episode ${episode.episode_number}`}
								loading="lazy"
								class="still-image" />
						{:else}
							<div
								class="grid aspect-video place-items-center rounded-lg ring dark:bg-zinc-900 dark:ring-white/5 dark:ring-inset">
								<span class="sr-only">No image</span>
								<Icon src={Photo} solid class="size-10" />
							</div>
						{/if}
						<figcaption class="mt-2">
							<Text class="uppercase">Episode {episode.episode_number}</Text>
							<Subheading level={4}>{episode.name}</Subheading>

							<Text class="my-2">{episode.overview}</Text>

							<div class="flex gap-3 dark:*:text-white">
								<Text class={{ hidden: !episode.runtime }}>
									{episode.runtime} min
								</Text>
								<Text class={{ hidden: !episode.air_date }}>
									{formatDate(episode.air_date, undefined, 'en-US')}
								</Text>
							</div>
						</figcaption>
					</figure>
				</di>
			{/each}
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.series-carousel {
		container-type: inline-size;
	}

	.carousel {
		/* Match layout: main has lg:px-2, inner div has p-6 lg:p-10, then max-w-6xl mx-auto */
		--container-max: 72rem;
		--layout-padding: --spacing(6);

		@media (width >= 64rem) {
			--layout-padding: calc(--spacing(2) + --spacing(10));
		}

		--gutter: max(calc((100vw - var(--container-max)) / 2), var(--layout-padding));

		inline-size: 100cqi;
		padding-block-start: --spacing(3);
		padding-inline-start: var(--gutter);
		scroll-padding-inline-start: var(--gutter);

		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 300px;
		gap: 2vmin;

		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		scroll-behavior: smooth;

		scroll-marker-group: before;
		margin-block-start: 1.5lh;

		&::scroll-marker-group {
			position-anchor: --carousel;

			inset-inline-start: anchor(left);
			inset-block-end: anchor(top);
			margin-inline-start: var(--gutter);

			@apply absolute flex gap-5;
		}

		&::after {
			content: '';
			display: block;
		}
	}

	.carousel__slide {
		container-type: scroll-state;
		@apply relative snap-start p-0;

		&.season-start::scroll-marker {
			content: 'Season ' attr(data-season-number);
			@apply text-base text-zinc-500 no-underline transition-['font-weight'] duration-300 dark:text-zinc-400;
		}

		/*! BUG: This seems to have no effect */
		&.season-start::scroll-marker:is(:hover, :focus-visible, :target-current) {
			@apply text-red-500 dark:text-red-500;
		}

		&.season-start::scroll-marker:target-current {
			@apply font-semibold text-zinc-950 dark:text-white;
		}

		&.season-start::scroll-marker:focus-visible {
			@apply rounded-md outline-2 outline-offset-4 outline-blue-500;
		}
	}

	:global(.carousel__slide .still-image) {
		@apply transition duration-300 ease-in-out;
		@container not scroll-state(snapped: inline) {
			@apply grayscale-75;
		}
	}
</style>
