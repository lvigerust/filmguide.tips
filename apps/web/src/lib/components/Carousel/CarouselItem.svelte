<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'

	let {
		ref = $bindable(),
		class: className,
		children,
		...restProps
	}: WithElementRef<SvelteHTMLElements['div' | 'a'], HTMLDivElement | HTMLAnchorElement> = $props()
</script>

<svelte:element
	this={'href' in restProps ? 'a' : 'div'}
	{...restProps}
	style="container-type: scroll-state;"
	class={cn('carousel__item block shrink-0 snap-start overflow-clip rounded-lg', className)}
	bind:this={ref}>
	{@render children?.()}
</svelte:element>
