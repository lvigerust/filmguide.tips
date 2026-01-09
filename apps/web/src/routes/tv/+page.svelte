<script lang="ts">
	import { getTvShows } from '$api'
	import { Carousel, CarouselItem } from '$components'
</script>

<Carousel class="full-bleed">
	{#each await getTvShows({ list: 'popular' }) as show (show.id)}
		<CarouselItem class="max-w-44">
			<img
				src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
				alt={show.name}
				class="object-cover" />
		</CarouselItem>
	{/each}
</Carousel>
