<script lang="ts">
	import { Image } from '$components'
	import type { Media } from '$types'
	import { RadioGroup } from 'bits-ui'
	import type { SvelteMap } from 'svelte/reactivity'

	let { items }: { items: SvelteMap<number, Media> } = $props()

	let itemsArray = $derived([...items.values()].slice(5, 8))
	let selectedItem = $derived(String(itemsArray[0].id))

	const changeLayout = (value: string) => {
		if (!document.startViewTransition) {
			selectedItem = value
			return
		}
		document.startViewTransition(() => (selectedItem = value))
	}
</script>

<RadioGroup.Root class="bento" value={selectedItem} onValueChange={changeLayout}>
	{#each itemsArray as item, i (item.id)}
		<div data-index={i + 1} class:checked={selectedItem === String(item.id)}>
			<RadioGroup.Item
				value={String(item.id)}
				class="focus:outline-none"
				style={`view-transition-name: opt-${i + 1}`}>
				<Image
					{item}
					alt={item.media_type === 'movie' ? item.title : item.name}
					sizes="100%"
					backdrop
					class="overflow-clip rounded-2xl" />
			</RadioGroup.Item>
		</div>
	{/each}
</RadioGroup.Root>

<style lang="postcss">
	@reference "tailwindcss";

	:root {
		--ease-spring-2: linear(
			0,
			0.007,
			0.029 2.2%,
			0.118 4.7%,
			0.625 14.4%,
			0.826 19%,
			0.902,
			0.962,
			1.008 26.1%,
			1.041 28.7%,
			1.064 32.1%,
			1.07 36%,
			1.061 40.5%,
			1.015 53.4%,
			0.999 61.6%,
			0.995 71.2%,
			1
		);
	}

	::view-transition-group(*) {
		animation-duration: 0.75s;
		animation-timing-function: var(--ease-spring-2);
	}

	:global(.bento) {
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: --spacing(3);

		& > div {
			display: grid;
			grid: 1fr / 1fr;

			&.checked {
				grid-row: 1 / -1;
				grid-column: 1;
			}
		}
	}
</style>
