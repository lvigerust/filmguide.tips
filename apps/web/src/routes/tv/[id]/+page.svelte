<script lang="ts">
	import Image from '$components/Image.svelte'
	import { Heading } from '@lvigerust/components/Heading'
	import { Text } from '@lvigerust/components/Text'
	import { Badge } from '@lvigerust/components/Badge'

	let { data } = $props()
	let show = $derived(data.show)
</script>

<div class="py-12">
	<div class="flex gap-8">
		<Image item={show} class="max-w-80 rounded-lg" sizes="320px" />

		<div class="flex flex-col gap-4">
			<Heading class="font-bold sm:text-2xl">{show.name}</Heading>

			{#if show.tagline}
				<Text class="italic">{show.tagline}</Text>
			{/if}

			<div class="flex gap-4">
				<Text>{show.first_air_date?.slice(0, 4)}</Text>
				<Text>{show.number_of_seasons} seasons</Text>
				<Text>{show.number_of_episodes} episodes</Text>
				<Text>{show.vote_average?.toFixed(1)} / 10</Text>
			</div>

			<Text class="max-w-prose">{show.overview}</Text>

			{#if show.genres?.length}
				<div class="flex gap-2">
					{#each show.genres as genre (genre.id)}
						<Badge class="dark:text-white">{genre.name}</Badge>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div>
		<Heading level={2}>Seasons</Heading>

		<ul>
			{#each data.seasons.values() as season (season._id)}
				<li>Season {season.season_number} - {season.episodes?.length} episodes</li>
			{/each}

			{#if data.seasons.size < show.number_of_seasons}
				<button>{show.number_of_seasons - data.seasons.size} more seasons</button>
			{/if}
		</ul>
	</div>
</div>
