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

<RadioGroup.Root class="bento full-bleed" value={selectedItem} onValueChange={changeLayout}>
	{#each itemsArray as item, i (item.id)}
		<div data-index={i + 1} class:checked={selectedItem === String(item.id)}>
			<RadioGroup.Item
				value={String(item.id)}
				class="cursor-pointer focus:outline-none"
				style={`view-transition-name: ${item.media_type}-${i + 1}; view-transition-class: image`}>
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

	::view-transition-group(*.image) {
		animation-duration: 0.75s;
		animation-timing-function: var(--ease-spring-2);
	}
</style>
