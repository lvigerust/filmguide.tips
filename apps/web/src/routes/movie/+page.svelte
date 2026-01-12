<script lang="ts">
	import { getMovies } from '$api'
	import HeroCarousel from '$components/HeroCarousel.svelte'
	import PosterCarousel from '$components/PosterCarousel.svelte'
</script>

<HeroCarousel items={await getMovies({ list: 'trending' })} />

<section class="mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Popular" items={await getMovies({ list: 'popular' })} />
	<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
	<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
	<PosterCarousel heading="Top Rated" items={await getMovies({ list: 'top_rated' })} />
</section>
