<script lang="ts">
	import Image from '$components/Image.svelte'

	let { data } = $props()
	let { show } = $derived(data)
</script>

<svelte:head>
	<title>{show.name}</title>
</svelte:head>

<Image item={show} class="max-w-96" sizes="384px" />
