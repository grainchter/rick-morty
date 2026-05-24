<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from '@/modules/shared/icons';

interface Props {
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();

const fillPercentage = computed(() => {
  if (!props.totalPages || props.totalPages === 1) return 100;

  return ((props.currentPage - 1) / (props.totalPages - 1)) * 100;
});

function goPrev() {
  if (props.currentPage > 1) {
    const newPage = props.currentPage - 1;
    emit('update:currentPage', newPage);
  }
}

function goNext() {
  if (props.currentPage < props.totalPages) {
    const newPage = props.currentPage + 1;
    emit('update:currentPage', newPage);
  }
}
</script>

<template lang="pug">
.pagination
  button.pagination__button(
    @click="goPrev",
    :disabled="currentPage === 1",
    aria-label="Предыдущая страница")
    ChevronLeft

  .pagination__liquid-container
    .pagination__liquid-fill(:style="{ width: `${fillPercentage}%` }")

    .pagination__counter
      span {{ currentPage }} / {{ totalPages }}

  button.pagination__button(
    @click="goNext",
    :disabled="currentPage === totalPages",
    aria-label="Следующая страница")
    ChevronRight
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 0;

  &__button {
    background-color: var(--pagination-background);
    color: white;
    padding: 0.75rem;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        transform: scale(1.05);
      }
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }
    &:disabled {
      background-color: var(--neutral-200);
      color: var(--neutral-400);
      cursor: not-allowed;
      transform: none;
      opacity: 1;
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &__liquid-container {
    position: relative;
    width: 16rem;
    height: 3.5rem;
    border: 1px solid var(--neutral-200);
    border-radius: 1rem;
    overflow: hidden;
    background-color: var(--neutral-100);
  }

  &__liquid-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(
      to right,
      var(--pagination-gradient-from),
      var(--pagination-gradient-to)
    );
    transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: width;
  }

  &__counter {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-weight: 600;
    font-size: 1.125rem;
    letter-spacing: -0.025em;
    color: white;
    mix-blend-mode: difference;
  }
}
</style>
