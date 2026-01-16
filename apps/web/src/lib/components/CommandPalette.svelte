<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import {
		Command,
		CommandButton,
		CommandEmpty,
		CommandGroup,
		CommandGroupHeading,
		CommandGroupItems,
		CommandLinkItem,
		CommandList
	} from '@lvigerust/components/Command'
	import { NavbarItem } from '@lvigerust/components/Navbar'
	import { Icon } from '@lvigerust/components/UI'
	import { ArrowPath, MagnifyingGlass } from 'svelte-heros-v2'
	import { searchMultiple } from '$api/search.remote'
	import type { MovieSearchItem, TvSearchItem } from '$types'
	import { SvelteMap } from 'svelte/reactivity'
	import { debounce } from '@lvigerust/utils'

	let { open = $bindable(false), ...restProps }: ComponentProps<typeof Command> = $props()

	let query = $state('')
	let searching = $state(false)

	let movies = new SvelteMap<number, MovieSearchItem>()
	let tvShows = new SvelteMap<number, TvSearchItem>()

	// Create the debounced function ONCE
	const debouncedSearch = debounce(async (q: string) => {
		if (!q.trim()) return
		searching = true
		const results = await searchMultiple(q)
		searching = false
		for (const [id, movie] of results.movies) movies.set(id, movie)
		for (const [id, show] of results.tvShows) tvShows.set(id, show)
	}, 400)

	const handleKeydown = async (e: KeyboardEvent) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault()
			open = !open
		}

		if (e.key !== 'Backspace') debouncedSearch(query)
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Command bind:open {...restProps} bind:inputValue={query} shouldFilter={false}>
	{#snippet button()}
		<CommandButton as={NavbarItem} aria-label="Command palette">
			<Icon src={MagnifyingGlass} />
		</CommandButton>
	{/snippet}

	<CommandList>
		<CommandGroup class={{ hidden: !movies.size }}>
			<CommandGroupHeading>Movies</CommandGroupHeading>
			<CommandGroupItems>
				{#each movies.values() as movie (movie.id)}
					<CommandLinkItem href="/movie/{movie.id}">
						<div>
							{movie.title}
							<span class="text-zinc-500">{movie.release_date}</span>
						</div>
					</CommandLinkItem>
				{/each}
			</CommandGroupItems>
		</CommandGroup>

		<CommandGroup class={{ hidden: !tvShows.size }}>
			<CommandGroupHeading>TV Shows</CommandGroupHeading>
			<CommandGroupItems>
				{#each tvShows.values() as show (show.id)}
					<CommandLinkItem href="/tv/{show.id}">
						<div>
							{show.name}
						</div>
					</CommandLinkItem>
				{/each}
			</CommandGroupItems>
		</CommandGroup>

		<CommandEmpty>
			{#if searching}
				<Icon src={ArrowPath} class="mx-auto size-8 animate-spin" solid />
			{:else}
				No results
			{/if}
		</CommandEmpty>
	</CommandList>
</Command>
