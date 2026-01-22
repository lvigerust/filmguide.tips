<script lang="ts">
	import '../app.css'
	import favicon from '$lib/assets/favicon.svg'
	import { page } from '$app/state'
	import { onNavigate } from '$app/navigation'
	import { AppLayout } from '$components'
	import { setUserState } from '$lib/app.svelte.js'
	import { untrack } from 'svelte'
	import { Toaster } from '@lvigerust/components/Toaster'

	/* View Transition API */
	onNavigate((navigation) => {
		if (!document.startViewTransition) return
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})

	let { data, children } = $props()

	untrack(() => setUserState(data.account))
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{[page.data.title, 'Filmguide'].filter(Boolean).join(' — ')}</title>
</svelte:head>

<Toaster />

<AppLayout>
	{@render children()}
</AppLayout>

<style lang="postcss">
	:global {
		:root {
			view-transition-name: none;
		}

		/* Keep page interactive while transitioning */
		::view-transition {
			pointer-events: none;
		}
	}
</style>
