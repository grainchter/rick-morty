<script setup lang="ts">
import Search from '../icons/Search.vue';

const model = defineModel<string>({ default: '' });
interface Props {
  placeholder?: string;
}
defineProps<Props>();
</script>

<template lang="pug">
.search
  Search.search__icon
  input.search__input(
    type="text",
    v-model="model",
    :placeholder="placeholder || 'Поиск...'",
    aria-label="Строка поиска")
</template>

<style lang="scss" scoped>
.search {
  position: relative;
  width: 100%;

  &__icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: var(--input-placeholder);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    box-sizing: border-box;
    background: var(--input-background);
    border: 1px solid var(--input-border);
    border-radius: var(--radius-lg);
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    font-size: 0.875rem;
    color: var(--foreground);
    outline: none;
    transition: all 0.2s;

    &::placeholder {
      color: var(--input-placeholder);
    }

    &:focus {
      border-color: var(--input-focus-border);
    }
  }
}
</style>
