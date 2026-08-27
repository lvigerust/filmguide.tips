<script lang="ts">
	import { getMovies } from '#api'
	import { Image } from '#components'
</script>

<div
	class={[
		// Columns
		'[--cols:2] sm:[--cols:5]',
		// Base styles
		'grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-6 gap-y-8'
	]}>
	{#each await getMovies('trending') as [id, movie] (id)}
		<div class="item">
			<div class="card">
				<Image item={movie} class="rounded-md" />
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	@property --stagger {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}

	.item {
		--in-view: false;
		--stagger: calc(mod(sibling-index() - 1, var(--cols, 1)));

		animation: item-in-view both;
		animation-timeline: view();
		animation-range: entry 0% entry 40%;
	}

	.card {
		animation: card-in both 0.8s paused;
		animation-delay: calc(var(--stagger) * 60ms);

		@container style(--in-view: true) {
			animation-play-state: running;
		}
	}

	@keyframes item-in-view {
		from {
			--in-view: false;
		}
		to {
			--in-view: true;
		}
	}
	@keyframes card-in {
		0% {
			opacity: 0;
			translate: 0 2rem;
		}
		100% {
			opacity: 1;
			translate: 0 0;
		}
	}
</style>
