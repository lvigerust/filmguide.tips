<script lang="ts">
	import { getShows } from '$api'
	import { HeroCarousel, PosterCarousel } from '$components'
</script>

<HeroCarousel items={await getShows({ list: 'trending' })} />

<section class="mt-10 full-bleed flex flex-col gap-y-10">
	<PosterCarousel heading="Popular" items={await getShows({ list: 'popular' })} />
	<PosterCarousel heading="Now Playing" items={await getShows({ list: 'on_the_air' })} />
	<PosterCarousel heading="Airing Today" items={await getShows({ list: 'airing_today' })} />
	<PosterCarousel heading="Top Rated" items={await getShows({ list: 'top_rated' })} />
</section>
