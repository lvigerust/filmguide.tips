<script lang="ts">
	import { getMovies } from '$api'
	import { HeroCarousel, PosterCarousel } from '$components'
</script>

<div class="-mt-6 lg:-mt-10">
	<HeroCarousel items={await getMovies({ list: 'top_rated' })} startIndex={1} />

	<section class="mt-6 full-bleed flex flex-col gap-y-6 sm:mt-10 sm:gap-y-10">
		<PosterCarousel heading="Trending" items={await getMovies({ list: 'trending' })} />
		<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
		<PosterCarousel heading="Popular" items={await getMovies({ list: 'popular' })} backdrop />
		<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
	</section>
</div>
