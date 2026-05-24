<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
interface Props {
  label?: string;
}
defineProps<Props>();
</script>

<template lang="pug">
.switch
  label.switch__row(v-if="label")
    span.switch__label {{ label }}

    button.switch__root(
      type="button",
      role="switch",
      :aria-checked="model",
      :data-state="model ? 'checked' : 'unchecked'",
      @click="model = !model")
      span.switch__thumb

  button.switch__root(
    v-else,
    type="button",
    role="switch",
    :aria-checked="model",
    :data-state="model ? 'checked' : 'unchecked'",
    @click="model = !model")
    span.switch__thumb
</template>

<style lang="scss" scoped>
.switch {
  display: block;
}

.switch__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  cursor: pointer;
}

.switch__label {
  flex: 1;
  font-size: 0.875rem;
  color: var(--foreground);
  text-transform: capitalize;
}

.switch__root {
  flex-shrink: 0;
  width: 2.75rem;
  height: 1.5rem;
  background: var(--switch-bg, #e5e7eb);
  border-radius: 9999px;
  position: relative;
  transition: background 0.2s;
  cursor: pointer;
  border: none;
  padding: 0;
}

.switch__root[data-state='checked'] {
  background: var(--switch-checked-bg, #111827);
}

.switch__thumb {
  position: absolute;
  top: 50%;
  left: 0.125rem;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  background: #ffffff;
  border-radius: 9999px;
  transition: transform 0.2s ease;
  will-change: transform;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.switch__root[data-state='checked'] .switch__thumb {
  transform: translate(1.25rem, -50%);
}
</style>
