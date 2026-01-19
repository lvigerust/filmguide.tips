<script lang="ts">
	import { Image } from '$components'
	import { Heading } from '@lvigerust/components/Heading'

	let { data } = $props()
	let { movie } = $derived(data)
</script>

<Image
	item={movie}
	class="max-w-[calc((100cqi/4))] rounded-lg sm:max-w-80 sm:rounded-xl"
	sizes="320px" />

<Heading>Bento grid with Collection movies</Heading>
