import type { User } from '$types'
import { createContext } from 'svelte'

export const [getUserState, setUserState] = createContext<User | null>()
