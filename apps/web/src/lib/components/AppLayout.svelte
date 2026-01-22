<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import { CommandPalette } from '$components'
	import { getUserState } from '$lib/app.svelte'
	import { navItems } from '$lib/config'
	import { Navbar, NavbarSection, NavbarItem, NavbarLabel } from '@lvigerust/components/Navbar'
	import {
		MobileSidebar,
		Sidebar,
		SidebarHeader,
		SidebarSection,
		SidebarItem,
		SidebarLabel,
		SidebarBody
	} from '@lvigerust/components/Sidebar'
	import { Icon } from '@lvigerust/components/UI'
	import type { Snippet } from 'svelte'
	import { Bars2 } from 'svelte-heros-v2'
	import AccountDropdownMenu from './AccountDropdownMenu.svelte'
	import { Dropdown, DropdownButton } from '@lvigerust/components/Dropdown'
	import { Avatar } from '@lvigerust/components/Avatar'
	import { PUBLIC_TMDB_IMG_URL } from '$env/static/public'

	let { children }: { children: Snippet } = $props()

	let showSidebar = $state(false)
	afterNavigate(() => (showSidebar = false)) // Close mobile sidebar when navigating

	const user = getUserState()
</script>

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
						<SidebarItem
							{href}
							current={page.url.pathname === href ||
								(href !== '/'
									? page.url.pathname.startsWith(href)
									: page.url.pathname.startsWith('/'))}>
							<SidebarLabel>{label}</SidebarLabel>
						</SidebarItem>
					{/each}
				</SidebarSection>
			</SidebarBody>
		</Sidebar>
	</MobileSidebar>

	<!--? Navbar -->
	<header class="flex items-center px-4">
		<div class="min-w-0 flex-1">
			<Navbar class="grid grid-cols-3">
				<NavbarSection class="lg:hidden">
					<NavbarItem onclick={() => (showSidebar = true)}>
						<Icon src={Bars2} solid />
					</NavbarItem>
				</NavbarSection>

				<NavbarSection class="max-lg:col-start-2 max-lg:justify-center">
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

				<NavbarSection class="col-start-3 justify-end">
					<CommandPalette />

					{#if user}
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar
									src={`${PUBLIC_TMDB_IMG_URL}/w45/${user.avatar?.tmdb?.avatar_path}`}
									initials={user.username?.[0]}
									class="bg-purple-500 text-white"
									alt={user.name}
									square />
							</DropdownButton>

							<AccountDropdownMenu align="end" />
						</Dropdown>
					{:else}
						<NavbarItem href="/api/auth/login">
							<NavbarLabel>Login</NavbarLabel>
						</NavbarItem>
					{/if}
				</NavbarSection>
			</Navbar>
		</div>
	</header>

	<!--? Content -->
	<main class="flex flex-1 flex-col pb-2 lg:px-2">
		<div class="grow p-6 pb-10 lg:p-10 lg:pb-20">
			<div class="mx-auto max-w-6xl">
				{@render children?.()}
			</div>
		</div>
	</main>
</div>

<style lang="postcss">
	/* Animate page indicator */
	:global([data-slot='mobile-sidebar'] [data-vt]) {
		view-transition-name: var(--transition-name, none);
	}

	::view-transition-group(current-indicator) {
		animation-duration: 0.3s;
		animation-timing-function: var(--ease-squish-1);
	}
</style>
