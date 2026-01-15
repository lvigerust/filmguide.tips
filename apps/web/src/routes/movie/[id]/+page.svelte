<script lang="ts">
	let { data } = $props()
	let { movie } = $derived(data)
</script>

<img
	src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
	alt={movie.title}
	class="max-w-96 object-cover"
	style:--transition-name={`movie-${movie.id}`} />
