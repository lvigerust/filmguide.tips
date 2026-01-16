<script lang="ts">
	import { getWatchProviders } from '$api/watchproviders.remote'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import { COUNTRIES } from '$lib/config'
	import type { Media } from '$types'
	import { untrack, type ComponentProps } from 'svelte'
	import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@lvigerust/components/Dialog'
	import { Button } from '@lvigerust/components/Button'
	import { cn } from '@lvigerust/utils'
	import { TextLink } from '@lvigerust/components/Text'
	import { Label } from '@lvigerust/components/Fieldset'
	import { RadioGroup } from 'bits-ui'

	let {
		item,
		class: className,
		children
	}: ComponentProps<typeof Button> & { item: Media } = $props()

	const countries = await untrack(() =>
		getWatchProviders({ id: item.id, media_type: item.media_type })
	)

	let open = $state(false)

	let selected = $state<keyof typeof COUNTRIES>('NO')
	let providers = $derived(countries?.[selected])
</script>

<Button onclick={() => (open = true)} plain class={cn('', className)}>
	{#if children}
		{@render children()}
	{:else}
		See providers
		<img src="/JustWatch_logo.svg.png" alt="" class="h-[0.5lh]" />
	{/if}
</Button>

<Dialog bind:open>
	<DialogTitle>Watch providers</DialogTitle>
	<DialogDescription>
		Providers are listed by country. You can customize the list of countries by creating an account.
		Watch provdiers are provided by <TextLink
			href={`https://www.themoviedb.org/${item.media_type}/${item.id}/watch`}
			target="_blank"
			class="text-blue-500 not-hover:no-underline dark:text-blue-400 dark:hover:decoration-blue-400">
			JustWatch
		</TextLink>.
	</DialogDescription>

	<DialogBody>
		<RadioGroup.Root bind:value={selected} class="grid grid-cols-4">
			{#each Object.entries(COUNTRIES) as [code, label] (code)}
				<div class="text-center">
					<RadioGroup.Item value={code}>
						<Label
							class="text-zinc-500 in-data-[state=checked]:font-semibold dark:text-zinc-400 dark:in-data-[state=checked]:text-white">
							{label}
						</Label>
					</RadioGroup.Item>
				</div>
			{/each}
		</RadioGroup.Root>

		<ul class="flex gap-4 p-8">
			{#each providers?.flatrate as provider (provider.provider_id)}
				<li>
					<img
						src="{PUBLIC_TMDB_IMG_URL}/w300{provider.logo_path}"
						alt={provider.provider_name}
						title={provider.provider_name}
						class="size-10 rounded" />
				</li>
			{/each}
		</ul>
	</DialogBody>
</Dialog>
