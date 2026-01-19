import type { Attachment } from 'svelte/attachments'

export const ref = <T extends Element>(set: (node: T | null) => void): Attachment<T> => {
	return (node) => {
		set(node)
		return () => set(null)
	}
}
