<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'

	let {
		ref = $bindable(),
		class: className,
		children,
		...restProps
	}: WithElementRef<SvelteHTMLElements['div'], HTMLDivElement> = $props()
</script>

<div
	{...restProps}
	class={cn(
		'carousel flex snap-x snap-mandatory gap-[2vmin] overflow-x-auto scroll-smooth pt-0.5',
		className
	)}
	bind:this={ref}>
	{@render children?.()}
</div>

<style lang="postcss">
	.carousel {
		scrollbar-width: none;
	}
</style>
