<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'

	let { class: className, children, ...restProps }: SvelteHTMLElements['div'] = $props()
</script>

<div
	{...restProps}
	style="container-type: scroll-state;"
	class={cn('carousel__item shrink-0 snap-start overflow-clip rounded-lg', className)}>
	{@render children?.()}
</div>
