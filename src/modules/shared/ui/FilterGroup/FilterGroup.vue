<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronDown } from '@/modules/shared/icons';

interface Props {
  title?: string;
  modelValue?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'toggle'): void;
}>();

const isOpen = ref(props.modelValue ?? false);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      isOpen.value = newVal;
    }
  },
);

function toggle() {
  isOpen.value = !isOpen.value;
  emit('update:modelValue', isOpen.value);
  emit('toggle');
}

defineExpose({ isOpen, toggle });
</script>

<template lang="pug">
.filter-group
  button.filter-group__trigger(type="button", @click="toggle", :aria-expanded="isOpen")
    span.filter-group__title {{ title || 'Фильтр' }}
    .filter-group__chevron(:class="{ 'filter-group__chevron--open': isOpen }")
      ChevronDown

  .filter-group__content(:class="{ 'filter-group__content--open': isOpen }")
    .filter-group__inner
      slot
</template>

<style lang="scss" scoped>
.filter-group {
  width: 100%;
  overflow: hidden;
}

.filter-group__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 0;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--foreground);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--primary);
  }
}

.filter-group__title {
  text-transform: capitalize;
}

.filter-group__chevron {
  display: inline-flex;
  transition: transform 0.2s ease;
  color: var(--muted-foreground);

  &--open {
    transform: rotate(180deg);
  }
}

.filter-group__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out;

  &--open {
    max-height: 500px;
  }
}

.filter-group__inner {
  overflow: hidden;
  padding-bottom: 0.75rem;
}
</style>
