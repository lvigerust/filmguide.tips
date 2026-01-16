<script lang="ts">
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'
	import { COUNTRIES } from '$lib/config'
	import type { WatchProviders } from '$types'
	import type { ComponentProps } from 'svelte'
	import { Dialog, DialogBody, DialogDescription, DialogTitle } from '@lvigerust/components/Dialog'
	import { Button } from '@lvigerust/components/Button'
	import { cn } from '@lvigerust/utils'
	import { Label } from '@lvigerust/components/Fieldset'
	import { RadioGroup } from 'bits-ui'

	let {
		providers,
		class: className,
		children
	}: ComponentProps<typeof Button> & { providers?: WatchProviders } = $props()

	let open = $state(false)

	let selectedCountry = $state<keyof typeof COUNTRIES>('NO')
	let availableCountries = $derived(
		(Object.keys(COUNTRIES) as (keyof typeof COUNTRIES)[]).filter(
			(code) => providers?.results?.[code]?.flatrate
		)
	)
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
	</DialogDescription>

	<DialogBody class="grid grid-cols-3 border-t pt-6">
		<RadioGroup.Root bind:value={selectedCountry} class="grid grid-flow-row gap-1">
			{#each availableCountries as code (code)}
				<div>
					<RadioGroup.Item value={code} class="focus:outline-none">
						<Label
							class="text-zinc-500 in-data-[state=checked]:font-semibold dark:text-zinc-400 dark:in-data-[state=checked]:text-white">
							{COUNTRIES[code]}
						</Label>
					</RadioGroup.Item>
				</div>
			{/each}
		</RadioGroup.Root>

		{#if providers?.results?.[selectedCountry]}
			<ul class="col-span-2 flex flex-wrap gap-2.5">
				{#each providers?.results?.[selectedCountry]?.flatrate as provider (provider.provider_id)}
					<li class="flex">
						<img
							src="{PUBLIC_TMDB_IMG_URL}/w300{provider.logo_path}"
							alt={provider.provider_name}
							title={provider.provider_name}
							class="size-12 shrink-0 rounded" />
					</li>
				{/each}
			</ul>
		{/if}
	</DialogBody>
</Dialog>
