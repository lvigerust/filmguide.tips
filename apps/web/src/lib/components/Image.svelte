<script lang="ts">
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'

	type Props = {
		path: string
		alt: string
		sizes?: string
		loading?: 'lazy' | 'eager'
		class?: string
	}

	let { path, alt, sizes = '100vw', loading = 'lazy', class: className }: Props = $props()
</script>

<picture class={className}>
	<source media="(max-width: 92px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w92/${path}`} />
	<source media="(max-width: 154px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w154/${path}`} />
	<source media="(max-width: 185px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w185/${path}`} />
	<source media="(max-width: 342px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w342/${path}`} />
	<source media="(max-width: 500px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w500/${path}`} />
	<source media="(max-width: 780px)" srcset={`${PUBLIC_TMDB_IMG_URL}/w780/${path}`} />
	<img src={`${PUBLIC_TMDB_IMG_URL}/original/${path}`} {alt} {sizes} {loading} />
</picture>
