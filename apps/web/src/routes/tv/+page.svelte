<script lang="ts">
	import { getTvShows } from '$api'
	import HeroCarousel from '$components/HeroCarousel.svelte'
	import PosterCarousel from '$components/PosterCarousel.svelte'
</script>

<HeroCarousel items={await getTvShows({ list: 'trending' })} />

<section class="full-bleed mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Popular" items={await getTvShows({ list: 'popular' })} />
	<PosterCarousel heading="Now Playing" items={await getTvShows({ list: 'on_the_air' })} />
	<PosterCarousel heading="Airing Today" items={await getTvShows({ list: 'airing_today' })} />
	<PosterCarousel heading="Top Rated" items={await getTvShows({ list: 'top_rated' })} />
</section>
