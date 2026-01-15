<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import type { TvSeasonDetails } from '$types'
	import type { SvelteMap } from 'svelte/reactivity'
	import type { SvelteHTMLElements } from 'svelte/elements'

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
			{#each season.episodes as episode, episodeIndex (episode.id)}
				{@const isSeasonStart = episodeIndex === 0}
				<div
					class="carousel__slide"
					class:season-start={isSeasonStart}
					data-season-content={isSeasonStart ? season.season_number : undefined}>
					<figure class="episode">
						{#if episode.still_path}
							<img
								src={`${PUBLIC_TMDB_IMG_URL}/w300${episode.still_path}`}
								srcset={`${PUBLIC_TMDB_IMG_URL}/w185${episode.still_path} 185w, ${PUBLIC_TMDB_IMG_URL}/w300${episode.still_path} 300w, ${PUBLIC_TMDB_IMG_URL}/w500${episode.still_path} 500w`}
								sizes="300px"
								width="300"
								height="169"
								alt={episode.name || `Episode ${episode.episode_number}`}
								loading="lazy" />
						{:else}
							<div class="episode__placeholder">
								<span>No image</span>
							</div>
						{/if}
						<figcaption class="episode-details">
							<p class="episode-number">Episode {episode.episode_number}</p>
							<p class="episode-title">{episode.name}</p>
							{#if episode.overview}
								<p class="episode-description">{episode.overview}</p>
							{/if}
							<p class="episode-meta">
								<span>{episode.runtime}min</span>
								<time datetime={episode.air_date}>{episode.air_date}</time>
							</p>
						</figcaption>
					</figure>
				</div>
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
		inline-size: 100cqi;
		padding-block-start: --spacing(3);
		padding-inline: 5vmin;
		scroll-padding-inline: 5vmin;

		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 300px;
		gap: 4vmin;

		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		scroll-behavior: smooth;

		scroll-marker-group: before;
		margin-block-start: 2lh;

		&::scroll-marker-group {
			position: absolute;
			position-anchor: --carousel;
			inset-inline-start: anchor(left);
			inset-block-end: anchor(top);
			margin-inline-start: 5vmin;

			block-size: 1lh;
			display: flex;
			gap: --spacing(7);
		}

		&::before,
		&::after {
			content: '';
			display: block;
			inline-size: 85cqi;
		}
	}

	.carousel__slide {
		padding: 0;
		position: relative;
		container-type: scroll-state;
		scroll-snap-align: start;

		&.season-start::scroll-marker {
			content: 'Season ' attr(data-season-content);
			white-space: nowrap;
			font-size: --text(lg);
			font-weight: 300;
			color: --color(zinc-400);
			text-decoration: underline 2px transparent;
			text-underline-offset: 5px;
			cursor: pointer;

			@media (prefers-reduced-motion: no-preference) {
				transition:
					text-decoration 0.8s ease,
					font-weight 0.3s ease;
			}
		}

		&.season-start::scroll-marker:is(:hover, :focus-visible, :target-current) {
			color: --color(zinc-100);
		}

		&.season-start::scroll-marker:target-current {
			text-decoration-color: --color(blue-500);
			font-weight: 800;
		}

		&.season-start::scroll-marker:focus-visible {
			outline-offset: 10px;
		}
	}

	.episode {
		display: grid;
		line-height: 1.25;
		anchor-name: --episode;
		anchor-scope: --episode;

		> img {
			background-color: --color(zinc-800);
			border-radius: --radius(lg);
			aspect-ratio: 16 / 9;
			object-fit: cover;
			width: 100%;
			transition: filter 0.3s ease;

			@container not scroll-state(snapped: inline) {
				filter: grayscale(1);
			}
		}

		> figcaption {
			padding-block-start: --spacing(3);

			> .episode-number {
				text-transform: uppercase;
				font-weight: 500;
				font-size: --text(xs);
				color: --color(zinc-400);
			}

			> .episode-title {
				font-size: --text(lg);
				font-weight: 700;
				line-height: 1.2;
				margin-block-start: --spacing(1);
				color: --color(zinc-100);
			}

			> .episode-description {
				margin-block: --spacing(2);
				font-weight: 300;
				font-size: --text(sm);
				color: --color(zinc-400);
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			> .episode-meta {
				display: flex;
				align-items: baseline;
				gap: --spacing(2);
				font-size: --text(xs);
				color: --color(zinc-500);
			}
		}
	}

	.episode__placeholder {
		background-color: --color(zinc-800);
		border-radius: --radius(lg);
		aspect-ratio: 16 / 9;
		display: grid;
		place-items: center;
		color: --color(zinc-500);
		font-size: --text(sm);
	}
</style>
