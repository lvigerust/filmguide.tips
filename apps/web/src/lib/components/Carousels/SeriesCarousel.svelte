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
		seen = { season_number: 1, episode_number: 3 },
		class: className,
		...restProps
	}: SvelteHTMLElements['div'] & {
		seasons: SvelteMap<number, TvSeasonDetails>
		seen?: { season_number: number; episode_number: number }
	} = $props()

	let activeSeason = $derived(seen.season_number)

	const goToSeason = (n: number) => {
		activeSeason = n
		const el = document.querySelector<HTMLElement>(`[data-season-number="${n}"]`)
		el?.scrollIntoView({ block: 'nearest', inline: 'start' })
		el?.focus({ preventScroll: true })
	}
</script>

<nav aria-label="Seasons" class="full-bleed supports-[scroll-marker-group:before]:hidden">
	<ul class="flex gap-5 overflow-x-auto px-(--gutter) [scrollbar-width:none]">
		{#each seasons.values() as season (season._id)}
			<li>
				<button
					type="button"
					aria-current={activeSeason === season.season_number ? 'true' : undefined}
					class={[
						'mb-4 whitespace-nowrap sm:text-base',
						activeSeason === season.season_number ? 'font-semibold text-white' : 'text-zinc-500'
					]}
					onclick={() => goToSeason(season.season_number)}>
					Season {season.season_number}
				</button>
			</li>
		{/each}
	</ul>
</nav>

<div class={cn('full-bleed', className)} {...restProps}>
	<div class="carousel">
		{#each seasons.values() as season (season._id)}
			{#each season.episodes as episode, index (episode.id)}
				<div
					class="carousel__item @container-[scroll-state] relative snap-start"
					class:seen={season.season_number < seen.season_number ||
						(season.season_number === seen.season_number &&
							episode.episode_number <= seen.episode_number)}
					class:scroll-button={index === 0}
					data-season-number={season.season_number}
					data-episode-number={episode.episode_number}>
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
								class="grid aspect-video place-items-center rounded-lg ring dark:bg-zinc-950/25 dark:ring-white/5 dark:ring-inset dark:lg:bg-zinc-900">
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

	:root {
		/* Match layout: main has lg:px-2, inner div has p-6 lg:p-10, then max-w-6xl mx-auto */
		--container-max: var(--container-6xl);
		--layout-padding: --spacing(6);

		@media (width >= 64rem) {
			--layout-padding: calc(--spacing(2) + --spacing(10));
		}

		--gutter: max(calc((100vw - var(--container-max)) / 2), var(--layout-padding));
	}

	.carousel {
		@apply scroll-px-(--gutter) px-(--gutter) pt-0.5;

		@apply grid auto-cols-[--spacing(80)] grid-flow-col gap-[2vmin];
		@apply snap-x snap-mandatory overflow-x-auto scroll-smooth;

		@apply @container-[scroll-state] [scroll-marker-group:before] [scrollbar-width:none];

		& > :not(.seen):nth-child(1 of :not(.seen)) {
			@apply scroll-start;
		}
	}

	/* Scroll marker for the first episode of a season */
	@supports (scroll-marker-group: before) {
		.carousel {
			&::scroll-marker-group {
				@apply mb-4 flex h-lh scroll-px-(--gutter) gap-5 overflow-x-scroll scroll-smooth px-(--gutter) [scrollbar-width:none];
			}

			.carousel__item.scroll-button {
				&::scroll-marker {
					content: 'Season ' attr(data-season-number);
					@apply whitespace-nowrap text-zinc-500 no-underline transition-['font-weight'] duration-300;
				}

				/*! BUG: This seems to have no effect */
				&::scroll-marker:is(:hover, :focus-visible, :target-current) {
					@apply text-red-500 dark:text-red-500;
				}

				&::scroll-marker:target-current {
					@apply font-semibold text-white;
				}

				&::scroll-marker:focus-visible {
					@apply rounded-md outline-2 outline-offset-4 outline-blue-500;
				}
			}
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
