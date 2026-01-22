// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Response } from '$types'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Response<'account-details'> | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface HTMLElement {
		startViewTransition?: (
			callbackOptions?: ViewTransitionUpdateCallback | StartViewTransitionOptions
		) => void
	}

	interface ScrollSnapEvent extends Event {
		snapTargetBlock: HTMLElement | null
		snapTargetInline: HTMLElement | null
	}

	interface HTMLElementEventMap {
		scrollsnapchange: ScrollSnapEvent
		scrollsnapchanging: ScrollSnapEvent
	}
}

export {}
