import { getMovies } from '#api'
import { SvelteMap } from 'svelte/reactivity'
import { onMount, tick } from 'svelte'
import type { Movie } from '#types'

type MovieList = Parameters<typeof getMovies>[0]['list']

const LOAD_THRESHOLD = 600

interface MovieFeedHandle {
	movies: SvelteMap<number, Movie>
	loadMore: () => Promise<void>
}

/**
 * An infinitely-scrollable, deduplicated feed of movies from a single TMDB list.
 * Thenable, so `const { movies, loadMore } = await new MovieFeed('popular')` resolves
 * once page 1 has loaded (this is what lets SSR render real content instead of an
 * empty grid). Resolves to a plain `{ movies, loadMore }` handle rather than the
 * `MovieFeed` instance itself — TypeScript disallows a thenable resolving to its own
 * type (it guards against infinite recursion in `Awaited<T>`), so this sidesteps that.
 */
export class MovieFeed {
	readonly movies = new SvelteMap<number, Movie>()

	#list: MovieList
	#pagesLoaded = 0
	#totalPages = 1
	#loading = false
	#ready: Promise<void>

	constructor(list: MovieList) {
		this.#list = list
		this.#ready = this.#loadPage(1)

		// the first page might not fill the viewport (tall/wide screens, zoomed-out
		// browsers) — scroll/resize can't help since there's nothing to scroll yet,
		// so check once the page is actually mounted and measurable
		onMount(() => this.loadMore())
	}

	then<TResult1 = MovieFeedHandle, TResult2 = never>(
		onfulfilled?: ((value: MovieFeedHandle) => TResult1 | PromiseLike<TResult1>) | null,
		onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
	): Promise<TResult1 | TResult2> {
		return this.#ready.then(() => {
			const handle: MovieFeedHandle = { movies: this.movies, loadMore: this.loadMore }
			return onfulfilled ? onfulfilled(handle) : (handle as unknown as TResult1)
		}, onrejected)
	}

	async #loadPage(page: number) {
		const result = await getMovies({ list: this.#list, page })
		for (const [id, movie] of result.movies) this.movies.set(id, movie)
		this.#pagesLoaded = page
		this.#totalPages = result.totalPages
	}

	/**
	 * Call from scroll/resize handlers — loads the next page once the viewport is within
	 * `LOAD_THRESHOLD`px of the bottom. An arrow field, not a method, so it stays bound to
	 * this instance even when destructured off it (`const { loadMore } = await new MovieFeed(...)`).
	 */
	loadMore = async (): Promise<void> => {
		if (this.#loading || this.#pagesLoaded >= this.#totalPages) return

		const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
		if (remaining >= LOAD_THRESHOLD) return

		this.#loading = true
		await this.#loadPage(this.#pagesLoaded + 1)
		this.#loading = false

		// the page we just added might still not fill the viewport
		await tick()
		this.loadMore()
	}
}
