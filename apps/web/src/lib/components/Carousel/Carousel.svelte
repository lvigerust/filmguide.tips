<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import type { SvelteHTMLElements } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'

	let {
		ref = $bindable(),
		buttons = false,
		markers = false,
		bleed = false,
		class: className,
		children,
		...restProps
	}: WithElementRef<SvelteHTMLElements['div'], HTMLDivElement> & {
		buttons?: boolean
		markers?: boolean
		bleed?: boolean
	} = $props()

	const id = $props.id()
</script>

<div
	{...restProps}
	class={cn(
		'carousel [--gap:1.5vmin] [--item-width:--spacing(40)]',
		buttons && 'carousel--scroll-buttons',
		markers && 'carousel--scroll-markers',
		bleed && 'full-bleed',
		className
	)}
	style:--carousel-anchor={`--carousel-${id}`}
	bind:this={ref}>
	{@render children?.()}
</div>

<style lang="postcss">
	@reference "#app.css";

	.carousel {
		anchor-name: var(--carousel-anchor);

		/* Behaviour */
		container-type: inline-size;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		&:focus-visible {
			outline: none;
		}

		/* Styles */
		display: grid;
		grid-auto-flow: column;
		padding-inline: var(--carousel-padding);
		scroll-padding-inline: var(--carousel-padding);
		column-gap: var(--gap);
		grid-auto-columns: var(--item-width);
		scrollbar-width: none;
	}

	.carousel--scroll-buttons {
		&::scroll-button(*) {
			@apply fixed [position-anchor:var(--carousel-anchor)] [position-visibility:always];
			@apply mx-4 aspect-square size-8.5 rounded-full border-0 bg-zinc-800/50 text-xl text-white;
		}

		&::scroll-button(*):hover {
			@apply bg-red-500;
		}

		&::scroll-button(*):disabled {
			@apply opacity-0;
		}

		&::scroll-button(right) {
			position-area: inline-end center;
			content: '→' / 'Next';
		}

		&::scroll-button(left) {
			position-area: inline-start center;
			content: '←' / 'Previous';
		}
	}

	.carousel--scroll-markers {
		scroll-marker-group: after;

		&::scroll-marker-group {
			/* Positioning */
			position: fixed;
			position-anchor: var(--carousel-anchor);
			position-area: block-end;
			position-visibility: always;

			/* Styles */
			@apply mt-5 grid auto-cols-auto grid-flow-col gap-3;
		}
	}
</style>
