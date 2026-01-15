<script lang="ts">
	import { cn } from '@lvigerust/utils'
	import { Carousel, CarouselItem } from '../Carousel'
	import type { ComponentProps } from 'svelte'

	const networks = [
		{ id: 213, name: 'Netflix', logo_path: '/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg' },
		{ id: 1024, name: 'Prime Video', logo_path: '/w7HfLNm9CWwRmAMU58udl2L7We7.svg' },
		{ id: 453, name: 'Hulu', logo_path: '/pqUTCleNUiTLAVlelGxUgWn1ELh.svg' },
		{ id: 2739, name: 'Disney+', logo_path: '/1edZOYAfoyZyZ3rklNSiUpXX30Q.svg' },
		{ id: 4330, name: 'Paramount+', logo_path: '/fi83B1oztoS47xxcemFdPMhIzK.svg' },
		{ id: 1112, name: 'Crunchyroll', logo_path: '/gNZh44MgDBwipGA9LwozlALjSdE.svg' },
		{ id: 1087, name: 'Comedy Central', logo_path: '/6ooPjtXufjsoskdJqj6pxuvHEno.svg' }
	] as const

	let { class: className }: ComponentProps<typeof Carousel> = $props()
</script>

<div class="full-bleed [--gutter:--spacing(6)] sm:[--gutter:--spacing(20)]">
	<Carousel class={cn('network__carousel scroll-px-(--gutter) px-(--gutter) py-px', className)}>
		{#each networks as network (network.id)}
			<CarouselItem
				class={[
					'grid w-80 place-items-center rounded-xl bg-zinc-950 p-6 ring sm:bg-zinc-900 dark:ring-inset'
				]}>
				<img
					src={`https://image.tmdb.org/t/p/original${network.logo_path}`}
					alt={network.name}
					class="w-1/2 self-center justify-self-center" />
			</CarouselItem>
		{/each}
	</Carousel>
</div>
