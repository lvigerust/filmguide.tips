<script lang="ts">
	import { getTvShows } from '$api'
	import HeroCarousel from '$components/HeroCarousel.svelte'
	import PosterCarousel from '$components/PosterCarousel.svelte'
</script>

<HeroCarousel items={await getTvShows({ list: 'popular' })} />

<section class="mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Now Playing" items={await getTvShows({ list: 'on_the_air' })} />
	<PosterCarousel heading="Upcoming" items={await getTvShows({ list: 'airing_today' })} />
</section>
