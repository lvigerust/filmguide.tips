<script lang="ts">
	import Image from '$components/Image.svelte'
	import { Heading, Subheading } from '@lvigerust/components/Heading'
	import { Text } from '@lvigerust/components/Text'
	import { BadgeButton } from '@lvigerust/components/Badge'
	import { formatDate, formatNumber, slugify } from '@lvigerust/utils'
	import { SeriesCarousel, WatchProviders } from '$components'

	let { data } = $props()
	let show = $derived(data.show)
</script>

<div class="space-y-12">
	<div class="flex gap-8 max-sm:flex-col">
		<Image
			item={show}
			class="max-w-[calc((100cqi/4))] rounded-lg sm:max-w-80 sm:rounded-xl"
			sizes="320px" />

		<div class="flex flex-col gap-4">
			<div class="flex">
				<Heading class="font-bold sm:text-2xl">
					{show.name}
					<span class="font-normal text-zinc-500 dark:text-zinc-400">
						({show.first_air_date && formatDate(show.first_air_date, { year: 'numeric' })})
					</span>
				</Heading>
			</div>

			<div class="flex gap-1.5">
				<Text>
					{show.first_air_date ? formatDate(show.first_air_date, undefined, 'en-US') : 'Unknown'}
				</Text>
				<span class="text-zinc-500">∙</span>
				<Text>{show.number_of_seasons} seasons</Text>
				<span class="text-zinc-500">∙</span>
				<Text>{show.number_of_episodes} episodes</Text>
				<span class="text-zinc-500">∙</span>
				<Text>{formatNumber(show.vote_average, { maximumFractionDigits: 1 }, 'en-US')} / 10</Text>
			</div>

			{#if show.genres?.length}
				<div class="flex gap-2">
					{#each show.genres as genre (genre.id)}
						<BadgeButton
							href={`/genre/${genre.id}-${slugify(genre.name || '')}/${show.media_type}`}
							class="dark:text-white">{genre.name}</BadgeButton>
					{/each}
				</div>
			{/if}

			<Text class="my-4 italic">{show.tagline}</Text>

			<div class="max-w-prose">
				<Subheading>Overview</Subheading>
				<Text class="mt-1">{show.overview}</Text>
			</div>

			<div>
				<WatchProviders providers={show['watch/providers']} class="-mx-3.5 sm:-mx-3" />
			</div>
		</div>
	</div>

	<div>
		<SeriesCarousel seasons={data.seasons} seen={{ season_number: 1, episode_number: 6 }} />
	</div>
</div>
