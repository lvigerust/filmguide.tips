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

<div class={cn('full-bleed', className)} {...restProps}>
	<div class="carousel">
		{#each seasons.values() as season (season._id)}
			{#each season.episodes as episode, index (episode.id)}
				<div
					style="container-type: scroll-state;"
					class="relative snap-start"
					class:scroll-button={index === 0}
					data-season-number={index === 0 ? season.season_number : undefined}>
					<figure class="group">
						{#if episode.still_path}
							<div class="overflow-hidden rounded-lg">
								<Image
									item={episode}
									still
									alt={episode.name || `Episode ${episode.episode_number}`}
									loading="lazy"
									class="scale-[102.5%] transition-transform duration-1000 ease-spring-1 group-hover:scale-100" />
							</div>
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

							<Text class="my-2 line-clamp-6">{episode.overview}</Text>

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
				</div>
			{/each}
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";

	.carousel {
		/* Match layout: main has lg:px-2, inner div has p-6 lg:p-10, then max-w-6xl mx-auto */
		--container-max: var(--container-6xl);
		--layout-padding: --spacing(6);

		@media (width >= 64rem) {
			--layout-padding: calc(--spacing(2) + --spacing(10));
		}

		--gutter: max(calc((100vw - var(--container-max)) / 2), var(--layout-padding));

		@apply scroll-ps-(--gutter) ps-(--gutter) pt-0.5;

		@apply grid auto-cols-[--spacing(80)] grid-flow-col gap-[2vmin];
		@apply snap-x snap-mandatory overflow-x-auto scroll-smooth;

		scrollbar-width: none;
		scroll-marker-group: before;

		&::scroll-marker-group {
			@apply mb-4 flex h-lh gap-5 px-(--gutter);
		}

		&::after {
			content: '';
			display: block;
		}
	}

	/* Scroll marker for the first episode of a season */
	.scroll-button {
		&::scroll-marker {
			content: 'Season ' attr(data-season-number);
			@apply text-zinc-500 no-underline transition-['font-weight'] duration-300 dark:text-zinc-400;
		}

		/*! BUG: This seems to have no effect */
		&::scroll-marker:is(:hover, :focus-visible, :target-current) {
			@apply text-red-500 dark:text-red-500;
		}

		&::scroll-marker:target-current {
			@apply font-semibold text-zinc-950 dark:text-white;
		}

		&::scroll-marker:focus-visible {
			@apply rounded-md outline-2 outline-offset-4 outline-blue-500;
		}
	}

	figure {
		/* Transition modifiers that are applied to the transition below */
		@apply transition-['filter'] duration-700 ease-out-3;

		/* Unsnapped items */
		@container not scroll-state(snapped: inline) {
			@apply not-hover:grayscale-75;
		}
	}
</style>
