import { apiFetch } from '@/modules/shared/api/client'
import type { CharacterFilters, CharactersApiResponse } from './types'

export async function getCharacters(filters: CharacterFilters) {
  return await apiFetch<CharactersApiResponse>('/character', { params: filters })
}
