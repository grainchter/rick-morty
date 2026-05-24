<script setup lang="ts">
import Card from '@/modules/shared/ui/Card/Card.vue';
import CardSkeleton from '@/modules/shared/ui/Card/CardSkeleton.vue';
import Badge from '@/modules/shared/ui/Badge/Badge.vue';
import CircleIcon from '@/modules/shared/ui/icons/CircleIcon.vue';
import Pagination from '@/modules/shared/ui/Pagination/Pagination.vue';
import { useCharactersFiltersStore } from '@/stores/charactersFiltersStore';
import { useCharactersQuery } from '../composables/useCharactersQuery';
import type { CharacterApiResponse } from '../api/types';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const filterStore = useCharactersFiltersStore();
const { apiFilters, page } = storeToRefs(filterStore);

const { data, isLoading, isError } = useCharactersQuery(apiFilters);

const currentPage = computed({
  get: () => page.value,
  set: (newPage: number) => {
    page.value = newPage;
  },
});

const totalPages = computed(() => data.value?.info?.pages || 1);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Alive':
      return '#10b981';
    case 'Dead':
      return '#ef4444';
    default:
      return '#f59e0b';
  }
};

const getInfoList = (character: CharacterApiResponse) => [
  {
    id: 'species',
    title: 'Species',
    description: character.species,
  },
  {
    id: 'location',
    title: 'Location',
    description: character.location.name,
  },
];
</script>

<template lang="pug">
.cards-grid
  template(v-if="isLoading")
    CardSkeleton(v-for="n in 6", :key="n")

  template(v-else-if="isError")
    .cards-grid__error
      .cards-grid__error-title Ошибка загрузки данных
      .cards-grid__error-text Попробуйте обновить страницу

  template(v-else-if="data?.results?.length")
    Card(
      v-for="character in data.results",
      :key="character.id",
      :imgURL="character.image",
      :title="character.name",
      :infoList="getInfoList(character)")
      template(#badge)
        Badge(:text="character.status")
          template(#icon)
            CircleIcon(:color="getStatusColor(character.status)")

  .cards-grid__empty(v-else)
    | Персонажи не найдены

Pagination(
  v-if="data?.results?.length",
  v-model:current-page="currentPage",
  :total-pages="totalPages")
</template>

<style scoped>
.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  justify-content: center;

  &__empty {
    text-align: center;
    padding: 2rem;
    font-size: 1.125rem;
    color: var(--neutral-600);
  }

  &__error {
    width: 100%;
    text-align: center;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__error-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--error, #ef4444);
  }

  &__error-text {
    font-size: 0.875rem;
    color: var(--neutral-600);
  }
}
</style>
