<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'
	import type { Pathname } from '$app/types'
	import { resolve } from '$app/paths'

	let {
		ref = $bindable(),
		class: className,
		href,
		children,
		...restProps
	}: WithElementRef<SvelteHTMLElements['div'], HTMLDivElement> & {
		href?: Pathname
	} = $props()
</script>

<div
	{...restProps}
	class={cn('carousel__item shrink-0 overflow-clip rounded-lg', className)}
	bind:this={ref}>
	{#if href}
		<a tabindex={-1} href={resolve(href)}>
			{@render children?.()}
		</a>
	{:else}
		{@render children?.()}
	{/if}
</div>

<style lang="postcss">
	@reference "#app.css";

	.carousel__item {
		&::scroll-marker {
			content: '' / attr(data-label);
			@apply size-3.5 rounded-full bg-white/10 transition-colors;
		}

		&::scroll-marker:hover {
			@apply bg-white/25;
		}

		&::scroll-marker:target-current {
			@apply bg-white/90;
		}
	}

	@supports (animation-timeline: view()) {
		.carousel__item.poster {
			animation: animate-out linear forwards;
			animation-timeline: view(inline);
			animation-range: exit;
		}
	}

	@keyframes animate-out {
		to {
			opacity: 0.5;
			scale: 0.95;
		}
	}
</style>
