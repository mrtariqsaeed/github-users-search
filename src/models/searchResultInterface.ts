import { User } from './userInterface'

export interface SearchResult {
    total_count: number
    incomplete_results: boolean
    items: User[]
}