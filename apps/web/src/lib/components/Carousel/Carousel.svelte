<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let { class: className, children, ...restProps }: SvelteHTMLElements['div'] = $props()
</script>

<div
	{...restProps}
	class={cn(
		'carousel flex snap-x snap-mandatory gap-x-4 overflow-x-auto scroll-smooth',
		className
	)}>
	{@render children?.()}
</div>

<style lang="postcss">
	.carousel {
		scrollbar-width: none;
	}
</style>
