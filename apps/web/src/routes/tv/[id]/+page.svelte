<script lang="ts">
	import Image from '$components/Image.svelte'
	import { Heading } from '@lvigerust/components/Heading'
	import { Text } from '@lvigerust/components/Text'
	import { BadgeButton } from '@lvigerust/components/Badge'
	import { Button } from '@lvigerust/components/Button'
	import {
		DescriptionList,
		DescriptionTerm,
		DescriptionDetails
	} from '@lvigerust/components/DescriptionList'
	import { slugify } from '@lvigerust/utils'
	import { SeriesCarousel } from '$components'

	let { data } = $props()
	let show = $derived(data.show)
</script>

<div class="space-y-12 py-12">
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
						<BadgeButton
							href={`/genre/${genre.id}-${slugify(genre.name || '')}/${show.media_type}`}
							class="dark:text-white">{genre.name}</BadgeButton>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div>
		<Heading level={2}>Seasons</Heading>

		<DescriptionList>
			{#each data.seasons.values() as season (season._id)}
				{#if season.episodes?.length}
					<DescriptionTerm>Season {season.season_number}</DescriptionTerm>
					<DescriptionDetails>Episodes {season.episodes.length}</DescriptionDetails>
				{/if}
			{/each}

			{#if data.seasons.size < show.number_of_seasons}
				<DescriptionTerm>
					<Button plain>{show.number_of_seasons - data.seasons.size} more seasons</Button>
				</DescriptionTerm>
			{/if}
		</DescriptionList>

		<SeriesCarousel seasons={data.seasons} />
	</div>
</div>
