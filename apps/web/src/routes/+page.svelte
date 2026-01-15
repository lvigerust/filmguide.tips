<script lang="ts">
	import { Heading } from '@lvigerust/components/Heading'
</script>

<div class="h-[150vh] py-12">
	<Heading class="heading font-semibold sm:text-4xl">
		Movies - Discover the latest movies and TV shows
	</Heading>
</div>

<div class="h-96">
	<Heading level={2} class="heading-2 font-semibold sm:text-4xl">Helllloooo on my way</Heading>
</div>

<style lang="postcss">
	@reference "tailwindcss";

	@keyframes greeting--leaveview {
		to {
			opacity: 0;
			translate: 0 20px;
		}
	}

	:global(.heading) {
		animation: greeting--leaveview linear both;
		animation-timeline: scroll(root);
		animation-range: 0 20vh;
	}

	@keyframes greeting--enterview {
		from {
			opacity: 0;
			translate: 0 -50px;
		}
	}

	:global(.heading-2) {
		animation: greeting--enterview linear both;
		animation-timeline: scroll(root);
		animation-range: 50vh 100vh;
	}
</style>
