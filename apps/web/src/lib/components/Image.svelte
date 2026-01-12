<script lang="ts">
	type Props = {
		path: string
		alt: string
		sizes?: string
		loading?: 'lazy' | 'eager'
		class?: string
	}

	let { path, alt, sizes = '100vw', loading = 'lazy', class: className }: Props = $props()

	const BASE_URL = 'https://image.tmdb.org/t/p'
</script>

<picture class={className}>
	<source media="(max-width: 92px)" srcset={`${BASE_URL}/w92/${path}`} />
	<source media="(max-width: 154px)" srcset={`${BASE_URL}/w154/${path}`} />
	<source media="(max-width: 185px)" srcset={`${BASE_URL}/w185/${path}`} />
	<source media="(max-width: 342px)" srcset={`${BASE_URL}/w342/${path}`} />
	<source media="(max-width: 500px)" srcset={`${BASE_URL}/w500/${path}`} />
	<source media="(max-width: 780px)" srcset={`${BASE_URL}/w780/${path}`} />
	<img src={`${BASE_URL}/original/${path}`} {alt} {sizes} {loading} />
</picture>
