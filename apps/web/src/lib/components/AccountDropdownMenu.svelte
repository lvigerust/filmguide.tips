<script lang="ts">
	import {
		DropdownDivider,
		DropdownHeading,
		DropdownItem,
		DropdownLabel,
		DropdownMenu,
		DropdownSection
	} from '@lvigerust/components/Dropdown'
	import { ArrowRightStartOnRectangle } from 'svelte-heros-v2'
	import { Icon } from '@lvigerust/components/UI'
	import { cn } from '@lvigerust/utils'
	import { navItems } from '$lib/config'
	import { page } from '$app/state'
	import type { ComponentProps } from 'svelte'

	let { class: className, ...restProps }: ComponentProps<typeof DropdownMenu> = $props()
</script>

<DropdownMenu {...restProps} class={cn('min-w-64', className)}>
	<!--? Pages -->
	<DropdownSection>
		<DropdownHeading>Pages</DropdownHeading>
		{#each navItems as { href, label } (label)}
			<DropdownItem {href}>
				<DropdownLabel>{label}</DropdownLabel>
			</DropdownItem>
		{/each}
	</DropdownSection>

	<DropdownDivider />

	<DropdownItem href={`/api/auth/logout?redirectTo=${encodeURIComponent(page.url.pathname)}`}>
		<Icon src={ArrowRightStartOnRectangle} micro />
		<DropdownLabel>Sign out</DropdownLabel>
	</DropdownItem>
</DropdownMenu>
