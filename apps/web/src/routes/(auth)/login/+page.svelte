<script lang="ts">
	import { Heading } from '@lvigerust/components/Heading'
	import { Button } from '@lvigerust/components/Button'
	import { getRequestToken } from '$api/account.remote'

	let approveUrl = $state<string>('')
</script>

<div class="mx-auto grid w-full max-w-sm grid-cols-1 gap-8">
	<Heading>Sign in to your account</Heading>

	{#if approveUrl}
		<Button href={approveUrl}>Approve application</Button>
	{:else}
		<Button
			onclick={async () => {
				const { approveUrl: url } = await getRequestToken()
				approveUrl = url
			}}>
			Get started
		</Button>
	{/if}
</div>
