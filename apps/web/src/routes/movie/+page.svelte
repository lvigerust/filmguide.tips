<script lang="ts">
	import { getMovies } from '$api'
	import { Carousel, CarouselItem } from '$components'
	import { Heading } from '@lvigerust/components/Heading'
</script>

<section>
	<Carousel class="full-bleed gap-x-10">
		{#each await getMovies({ list: 'popular' }) as movie, i (movie.id)}
			<CarouselItem class="relative max-w-4xl snap-center">
				<figure class:scroll-start={i === 1}>
					<picture>
						<img
							src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
							alt={movie.title}
							class="object-cover" />
					</picture>

					<figcaption
						class="absolute inset-0 flex items-end opacity-0 transition-opacity duration-1000 ease-in-out">
						<div class="flex w-full bg-linear-to-b to-black px-10 py-12">
							<Heading level={3}>{movie.title}</Heading>
						</div>
					</figcaption>
				</figure>
			</CarouselItem>
		{/each}
	</Carousel>
</section>

<section class="mt-12">
	<Heading class="mb-4">Popular</Heading>
	<Carousel class="full-bleed">
		{#each await getMovies({ list: 'now_playing' }) as movie (movie.id)}
			<CarouselItem class=" max-w-44">
				<img
					src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
					alt={movie.title}
					class="object-cover" />
			</CarouselItem>
		{/each}
	</Carousel>

	<Heading class="mt-8 mb-4">Now Playing</Heading>
	<Carousel class="full-bleed">
		{#each await getMovies({ list: 'upcoming' }) as movie (movie.id)}
			<CarouselItem class="max-w-44">
				<img
					src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
					alt={movie.title}
					class="object-cover" />
			</CarouselItem>
		{/each}
	</Carousel>
</section>

<style lang="postcss">
	@reference "tailwindcss";

	@container scroll-state(snapped: inline) {
		figcaption {
			@apply opacity-100;
		}
	}
</style>
