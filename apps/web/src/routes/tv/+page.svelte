<script lang="ts">
	import { getShows } from '$api'
	import { HeroCarousel, PosterCarousel } from '$components'
	import type { Snapshot } from '@sveltejs/kit'

	let startSnap = $state(1)

	export const snapshot: Snapshot<number> = {
		capture: () => startSnap,
		restore: (value) => (startSnap = value)
	}
</script>

<div class="-mt-6 lg:-mt-10">
	<HeroCarousel bind:startSnap items={await getShows('trending')} />

	<section class="mt-6 full-bleed flex flex-col gap-y-6 sm:mt-10 sm:gap-y-10">
		<PosterCarousel heading="Popular" items={await getShows('popular')} />
		<PosterCarousel heading="Top Rated" items={await getShows('top_rated')} backdrop />
		<PosterCarousel heading="On the Air" items={await getShows('on_the_air')} />
		<PosterCarousel heading="Airing Today" items={await getShows('airing_today')} />
	</section>
</div>
