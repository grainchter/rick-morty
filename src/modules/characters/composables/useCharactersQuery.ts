import { getCharacters } from '../api/endpoints';
import type { CharacterFilters } from '../api/types';
import { ApiError } from '@/modules/shared/api/client';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

function getRateLimitDelay(error: unknown): number {
  if (error instanceof ApiError && error.response.status === 429) {
    const retryAfter = error.response.headers.get('Retry-After');
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) return seconds * 1000;
    }
  }
  return 5000;
}

export function useCharactersQuery(filters: Ref<CharacterFilters>) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => getCharacters(filters.value),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,

    retry: (failureCount, error) => {
      if (failureCount >= 5) return false;

      if (error instanceof ApiError && error.response.status === 429) return true;
      if (error instanceof TypeError) return true;

      return false;
    },

    retryDelay: (failureCount, error) => {
      return getRateLimitDelay(error);
    },
  });
}
