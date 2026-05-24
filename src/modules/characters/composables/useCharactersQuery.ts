import { getCharacters } from '../api/endpoints';
import type { CharacterFilters } from '../api/types';

import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

export function useCharactersQuery(filters: Ref<CharacterFilters>) {
  return useQuery({
    queryKey: ['characters', filters],
    queryFn: () => getCharacters(filters.value),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // @ts-expect-error — у ошибки из queryFn есть поле response от fetch,
      // но стандартный тип Error его не содержит
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}
