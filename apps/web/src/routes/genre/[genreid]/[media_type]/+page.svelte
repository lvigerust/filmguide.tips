<script lang="ts">
	import { page } from '$app/state'
	import { Heading } from '@lvigerust/components/Heading'

	const { genreid, media_type } = $derived(page.params)
</script>

<Heading>{genreid}</Heading>

<Heading>{media_type}</Heading>
