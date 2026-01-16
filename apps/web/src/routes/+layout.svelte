<script lang="ts">
	import '../app.css'
	import favicon from '$lib/assets/favicon.svg'
	import { Navbar, NavbarSection, NavbarItem, NavbarLabel } from '@lvigerust/components/Navbar'
	import { navItems } from '$lib/config'
	import { Icon } from '@lvigerust/components/UI'
	import { Bars2 } from 'svelte-heros-v2'
	import { page } from '$app/state'
	import {
		MobileSidebar,
		Sidebar,
		SidebarBody,
		SidebarHeader,
		SidebarItem,
		SidebarLabel,
		SidebarSection
	} from '@lvigerust/components/Sidebar'
	import { afterNavigate } from '$app/navigation'
	import { CommandPalette } from '$components'

	let { children } = $props()

	let showSidebar = $state(false)
	afterNavigate(() => (showSidebar = false)) // Close mobile sidebar when navigating
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{[page.data.title, 'Filmguide'].filter(Boolean).join(' — ')}</title>
</svelte:head>

<div
	class="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
	<!--? Sidebar on mobile -->
	<MobileSidebar bind:open={showSidebar}>
		<Sidebar>
			<SidebarHeader>
				<SidebarSection>
					<SidebarItem>
						<SidebarLabel>Filmguide</SidebarLabel>
					</SidebarItem>
				</SidebarSection>
			</SidebarHeader>

			<SidebarBody>
				<SidebarSection>
					{#each navItems as { href, label } (href)}
						<SidebarItem {href}>
							<SidebarLabel>{label}</SidebarLabel>
						</SidebarItem>
					{/each}
				</SidebarSection>
			</SidebarBody>
		</Sidebar>
	</MobileSidebar>

	<!--? Navbar -->
	<header class="flex items-center px-4">
		<div class="py-2.5 lg:hidden">
			<NavbarItem onclick={() => (showSidebar = true)}>
				<Icon src={Bars2} solid />
			</NavbarItem>
		</div>
		<div class="min-w-0 flex-1">
			<Navbar class="grid grid-cols-3">
				<NavbarSection class="max-lg:hidden">
					<NavbarItem href="/">
						<NavbarLabel>Filmguide</NavbarLabel>
					</NavbarItem>
				</NavbarSection>

				<NavbarSection class="justify-center max-lg:hidden">
					{#each navItems as { label, href } (label)}
						<NavbarItem {href}>
							<NavbarLabel>{label}</NavbarLabel>
						</NavbarItem>
					{/each}
				</NavbarSection>

				<NavbarSection class="justify-end">
					<CommandPalette />
				</NavbarSection>
			</Navbar>
		</div>
	</header>

	<!--? Content -->
	<main class="flex flex-1 flex-col pb-2 lg:px-2">
		<div class="grow p-6 lg:p-10">
			<div class="mx-auto max-w-6xl">
				{@render children?.()}
			</div>
		</div>
	</main>
</div>
