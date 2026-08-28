<script lang="ts">
	import { getMovies } from '#api'
	import { HeroCarousel, PosterCarousel } from '#components'
	import { snapshot } from '$app/navigation'

	let startSnap = $state(1)

	snapshot({
		capture: () => startSnap,
		restore: (value) => (startSnap = value)
	})
</script>

<div class="-mt-6 lg:-mt-10">
	<HeroCarousel bind:startSnap items={(await getMovies({ list: 'trending', page: 1 })).movies} />

	<section class="mt-6 flex flex-col gap-y-6 sm:mt-10 sm:gap-y-10">
		<PosterCarousel
			heading="Now Playing"
			items={(await getMovies({ list: 'now_playing', page: 1 })).movies} />
		<PosterCarousel
			heading="Popular"
			items={(await getMovies({ list: 'popular', page: 1 })).movies} />
		<PosterCarousel
			heading="Upcoming"
			items={(await getMovies({ list: 'upcoming', page: 1 })).movies}
			backdrop />
		<PosterCarousel
			heading="Top Rated"
			items={(await getMovies({ list: 'top_rated', page: 1 })).movies} />
	</section>
</div>
