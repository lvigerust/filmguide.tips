<script lang="ts">
	import { getMovies } from '$api'
	import { BackdropCarousel, HeroCarousel, NetworkCarousel, PosterCarousel } from '$components'
</script>

<HeroCarousel items={await getMovies({ list: 'trending' })} />

<NetworkCarousel class="mt-10 " />
<section class="full-bleed mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Popular" items={await getMovies({ list: 'popular' })} />
	<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
	<BackdropCarousel heading="Top Rated" items={await getMovies({ list: 'top_rated' })} />
	<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
</section>
