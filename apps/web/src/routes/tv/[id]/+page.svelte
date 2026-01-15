<script lang="ts">
	import Image from '$components/Image.svelte'

	let { data } = $props()
	let { show } = $derived(data)
</script>

<Image item={show} class="max-w-96" sizes="384px" />
