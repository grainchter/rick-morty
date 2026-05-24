<script setup lang="ts">
import FilterSidebar from '@/modules/shared/ui/FilterSidebar/FilterSidebar.vue';
import FilterGroup from '@/modules/shared/ui/FilterGroup/FilterGroup.vue';
import SearchInput from '@/modules/shared/ui/SearchInput/SearchInput.vue';
import Switch from '@/modules/shared/ui/Switch/Switch.vue';
import Select from '@/modules/shared/ui/Select/Select.vue';
import { speciesOptions } from '@/modules/shared/config';
import { debounce } from '@/modules/shared/utils/debounce';
import { useCharactersFiltersStore } from '@/stores/charactersFiltersStore';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';

const store = useCharactersFiltersStore();
const { name, status, species } = storeToRefs(store);

const updateNameDebounced = debounce((value: string) => {
  name.value = value;
}, 300);

const searchModel = computed({
  get: () => name.value,
  set: (value: string) => updateNameDebounced(value),
});

const setStatus = (newStatus: 'alive' | 'dead' | 'unknown' | '') => {
  status.value = newStatus;
};
</script>

<template lang="pug">
FilterSidebar
  template(#header)
    h2 Фильтры

  FilterGroup(title="Search", :modelValue="true")
    SearchInput(v-model="searchModel", placeholder="Search by name...")

  .divider

  FilterGroup(title="Status")
    .switches-wrapper
      Switch(
        :model-value="status === 'alive'",
        @update:model-value="(val) => val && setStatus('alive')",
        label="alive")
      Switch(
        :model-value="status === 'dead'",
        @update:model-value="(val) => val && setStatus('dead')",
        label="dead")
      Switch(
        :model-value="status === 'unknown'",
        @update:model-value="(val) => val && setStatus('unknown')",
        label="unknown")

  .divider

  FilterGroup(title="Species")
    Select(v-model="species", :options="speciesOptions", placeholder="Select species")
</template>

<style lang="scss" scoped>
.divider {
  height: 1px;
  background: var(--border);
}

.switches-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
