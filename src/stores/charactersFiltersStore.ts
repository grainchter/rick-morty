import { debounce } from '@/modules/shared/utils/debounce';
import { defineStore } from 'pinia';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type Status = 'alive' | 'dead' | 'unknown' | '';

export const useCharactersFiltersStore = defineStore('filters', () => {
  const route = useRoute();
  const router = useRouter();

  const name = ref('');
  const status = ref<Status>('');
  const species = ref('All');
  const page = ref(1);

  let isInternalUpdate = false;

  // чтение фильтров из URL (вызывается при инициализации и при изменении query)
  function syncFromUrl() {
    isInternalUpdate = true;
    const query = route.query;
    name.value = (query.name as string) || '';
    status.value = (query.status as Status) || '';
    species.value = (query.species as string) || 'All';
    page.value = query.page ? Number(query.page) : 1;
    if (isNaN(page.value)) page.value = 1;
    nextTick(() => {
      isInternalUpdate = false;
    });
  }
  // обновление URL при изменении фильтров
  const updateUrlDebounced = debounce(() => {
    const query: Record<string, string> = {};
    if (name.value) query.name = name.value;
    if (status.value) query.status = status.value;
    if (species.value && species.value !== 'All') query.species = species.value;
    if (page.value !== 1) query.page = String(page.value);
    router.replace({ path: route.path, query });
  }, 300);

  watch([name, status, species], () => {
    if (!isInternalUpdate && page.value !== 1) {
      page.value = 1;
    }
  });

  watch([name, status, species, page], () => {
    updateUrlDebounced();
  });

  watch(
    () => route.query,
    () => {
      syncFromUrl();
    },
  );

  syncFromUrl();

  // готовый объект для API
  const apiFilters = computed(() => ({
    name: name.value || undefined,
    status: status.value || undefined,
    species: species.value === 'All' ? undefined : species.value,
    page: page.value,
  }));

  // сброc всех фильтров
  function resetFilters() {
    name.value = '';
    status.value = '';
    species.value = 'All';
    page.value = 1;
  }

  return {
    name,
    status,
    species,
    page,
    resetPage: () => {
      page.value = 1;
    },
    resetFilters,
    apiFilters,
  };
});
