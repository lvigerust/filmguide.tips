<script lang="ts">
	import { getMovies } from '$api'
	import { Bento } from '$components'
</script>

<Bento items={await getMovies('popular')} />
