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
	<HeroCarousel bind:startSnap items={await getMovies({ list: 'top_rated' })} />

	<section class="mt-6 full-bleed flex flex-col gap-y-6 sm:mt-10 sm:gap-y-10">
		<PosterCarousel heading="Trending" items={await getMovies({ list: 'trending' })} />
		<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
		<PosterCarousel heading="Popular" items={await getMovies({ list: 'popular' })} backdrop />
		<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
	</section>
</div>
