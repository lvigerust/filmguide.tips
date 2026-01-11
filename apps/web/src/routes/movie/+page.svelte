<script lang="ts">
	import { getMovies } from '$api'
	import HeroCarousel from '$components/HeroCarousel.svelte'
	import PosterCarousel from '$components/PosterCarousel.svelte'
</script>

<HeroCarousel items={await getMovies({ list: 'popular' })} />

<section class="mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
	<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
</section>
