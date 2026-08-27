<script lang="ts">
	import { Button } from '@lvigerust/components/Button'

	let count = $state(12)

	let radiusWidth = $state<number>()
</script>

<div class="flex justify-center gap-3">
	<Button onclick={() => count++}>Add</Button>
	<Button onclick={() => count--}>Remove</Button>
</div>

<div
	bind:clientWidth={radiusWidth}
	style:--orbit-radius="{radiusWidth ? radiusWidth / 2 - 45 : 0}px"
	class="sibling-orbit relative mx-auto mt-10 aspect-square w-lg rounded-full border-3 border-dashed">
	{#each { length: count }}
		<div class="sibling-dot absolute top-1/2 left-1/2 size-12 rounded-full"></div>
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.sibling-orbit > * {
		--angle: calc(360deg / sibling-count() * sibling-index());
		--hue: calc(sibling-index() * 360deg / sibling-count());

		background: oklch(70% 70% var(--hue));

		transition: transform 1s var(--ease-spring-2);

		transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--orbit-radius) * -1))
			rotate(calc(var(--angle) * -1));
	}
</style>
