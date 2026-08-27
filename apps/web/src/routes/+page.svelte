<script lang="ts">
	import { getMovies } from '#api'
	import { Image } from '#components'
</script>

<div class="@container grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
	{#each await getMovies('trending') as [id, movie] (id)}
		<div class="item">
			<div class="card">
				<Image item={movie} class="rounded-md" />
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	@container (width < 40rem) {
		.item:nth-child(2n + 1) {
			--stagger: 0;
		}
		.item:nth-child(2n) {
			--stagger: 1;
		}
	}
	@container (width >= 40rem) {
		.item:nth-child(4n + 1) {
			--stagger: 0;
		}
		.item:nth-child(4n + 2) {
			--stagger: 1;
		}
		.item:nth-child(4n + 3) {
			--stagger: 2;
		}
		.item:nth-child(4n) {
			--stagger: 3;
		}
	}

	.item {
		--in-view: false;

		animation: item-in-view both;
		animation-timeline: view();
		animation-range: entry 0% entry 40%;
	}

	.card {
		animation: card-in both 0.8s paused;
		animation-delay: calc(var(--stagger, 0s) * 60ms);

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
