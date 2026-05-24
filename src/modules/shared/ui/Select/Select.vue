<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ChevronDown from '../icons/ChevronDown.vue';

interface Props {
  modelValue?: string;
  options: string[];
  placeholder?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({ top: '0px', left: '0px', width: '0px' });

const value = computed({
  get: () => props.modelValue ?? '',
  set: (val: string) => emit('update:modelValue', val),
});

function toggle() {
  if (!isOpen.value) updateDropdownPosition();
  isOpen.value = !isOpen.value;
}

function updateDropdownPosition() {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();

  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  };
}

function selectOption(opt: string) {
  value.value = opt;
  isOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('keydown', handleEscape);
});
</script>

<template lang="pug">
.select
  button.select__trigger(
    ref="triggerRef",
    type="button",
    @click="toggle",
    :class="{ 'select__trigger--open': isOpen }")
    span.select__value {{ value || placeholder || 'Select...' }}

    .select__icon
      ChevronDown

  Teleport(to="body")
    .select__overlay(v-if="isOpen", @click="isOpen = false")

    .select__content(v-if="isOpen", :style="dropdownStyle")
      .select__viewport
        button.select__item(
          v-for="opt in options",
          :key="opt",
          @click="selectOption(opt)",
          :class="{ 'select__item--selected': opt === value }") {{ opt }}
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  width: 100%;
}

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    border-color: #9ca3af;
    outline: none;
  }
}

.select__trigger--open .select__icon {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.select__value {
  flex: 1;
  text-align: left;
}

.select__icon {
  display: inline-flex;
  color: #6b7280;

  svg {
    width: 1rem;
    height: 1rem;
  }
}

.select__overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.select__content {
  position: fixed;
  z-index: 50;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.select__viewport {
  padding: 0.25rem;
}

.select__item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: transparent;
  border: none;

  &:hover {
    background: #f3f4f6;
  }
}

.select__item--selected {
  background: #f3f4f6;
  font-weight: 500;
}
</style>
