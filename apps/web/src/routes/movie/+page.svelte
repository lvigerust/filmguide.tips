<script lang="ts">
	import { getMovies } from '$api'
	import { PosterCarousel } from '$components'
</script>

<div class="full-bleed mt-10 flex flex-col gap-y-10">
	<PosterCarousel heading="Trending" items={await getMovies({ list: 'trending' })} />
	<PosterCarousel heading="Now Playing" items={await getMovies({ list: 'now_playing' })} />
	<PosterCarousel heading="Popular" items={await getMovies({ list: 'popular' })} backdrop />
	<PosterCarousel heading="Upcoming" items={await getMovies({ list: 'upcoming' })} />
</div>
