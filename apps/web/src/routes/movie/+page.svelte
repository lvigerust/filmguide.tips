<script lang="ts">
	import { getMovies } from '$api'
	import { HeroCarousel, PosterCarousel } from '$components'
	import type { Snapshot } from '@sveltejs/kit'

	let startSnap = $state(1)

	export const snapshot: Snapshot<number> = {
		capture: () => startSnap,
		restore: (value) => (startSnap = value)
	}
</script>

<div class="-mt-6 lg:-mt-10">
	<HeroCarousel bind:startSnap items={await getMovies('trending')} />

	<section class="mt-6 full-bleed flex flex-col gap-y-6 sm:mt-10 sm:gap-y-10">
		<PosterCarousel heading="Now Playing" items={await getMovies('now_playing')} />
		<PosterCarousel heading="Popular" items={await getMovies('popular')} />
		<PosterCarousel heading="Upcoming" items={await getMovies('upcoming')} backdrop />
		<PosterCarousel heading="Top Rated" items={await getMovies('top_rated')} />
	</section>
</div>
