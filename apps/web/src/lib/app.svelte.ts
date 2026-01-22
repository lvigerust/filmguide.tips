import type { Account } from '$types'
import { createContext } from 'svelte'

export const [getAccountState, setAccountState] = createContext<Account | null>()
