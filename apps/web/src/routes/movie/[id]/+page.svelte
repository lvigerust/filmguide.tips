<script lang="ts">
	import Image from '$components/Image.svelte'
	import { Heading, Subheading } from '@lvigerust/components/Heading'
	import { Text } from '@lvigerust/components/Text'
	import { BadgeButton } from '@lvigerust/components/Badge'
	import { formatDate, formatNumber, slugify } from '@lvigerust/utils'
	import { WatchProviders } from '$components'
	import { Button } from '@lvigerust/components/Button'
	import { toast } from '@lvigerust/components/Toaster'
	import { addToWatchlist } from '$api/account.remote.js'
	import { getUserState } from '$lib/app.svelte.js'

	let { data } = $props()
	let movie = $derived(data.movie)

	const user = getUserState()
</script>

<div class="space-y-8 sm:space-y-12">
	<div class="flex gap-6 max-sm:flex-col sm:gap-8">
		<Image
			item={movie}
			class="max-w-[calc((100cqi/4))] rounded-lg sm:max-w-80 sm:rounded-xl"
			sizes="320px" />

		<div class="flex flex-col gap-4">
			<div class="flex">
				<Heading class="font-bold sm:text-2xl">
					{movie.title}
					<span class="font-normal text-zinc-500 dark:text-zinc-400">
						({movie.release_date && formatDate(movie.release_date, { year: 'numeric' })})
					</span>
				</Heading>
			</div>

			<div class="flex flex-wrap gap-1.5">
				<Text>
					{movie.release_date ? formatDate(movie.release_date, undefined, 'en-US') : 'Unknown'}
				</Text>
				<span class="text-zinc-500">∙</span>
				<Text>{formatNumber(movie.vote_average, { maximumFractionDigits: 1 }, 'en-US')} / 10</Text>
			</div>

			{#if movie.genres?.length}
				<div class="flex gap-2">
					{#each movie.genres as genre (genre.id)}
						<BadgeButton
							href={`/genre/${genre.id}-${slugify(genre.name || '')}/${movie.media_type}`}
							class="dark:text-white">{genre.name}</BadgeButton>
					{/each}
				</div>
			{/if}

			<Text class="my-4 italic">{movie.tagline}</Text>

			<div class="max-w-prose">
				<Subheading>Overview</Subheading>
				<Text class="mt-1">{movie.overview}</Text>
			</div>

			<div class="flex flex-col items-start gap-2">
				<WatchProviders providers={movie['watch/providers']} class="-mx-3.5 sm:-mx-3" />

				{#if user}
					<Button
						plain
						onclick={async () => {
							toast.promise(() => addToWatchlist({ id: movie.id, media_type: movie.media_type }), {
								loading: 'Adding to watchlist…',
								success: 'Added to watchlist',
								error: 'Failed to add to watchlist',
								description: movie.title
							})
						}}>
						Add to watchlist
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
