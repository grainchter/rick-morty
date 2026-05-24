<script setup lang="ts">
interface Props {
  text: string;
}

defineProps<Props>();
</script>

<template lang="pug">
.badge
  .badge__icon
    slot(name="icon")
  span.badge__text {{ text }}
</template>

<style lang="scss" scoped>
.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background-color: var(--background);
}

.badge__icon {
  display: flex;
  align-items: center;
  line-height: 0;
}

.badge__text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--neutral-700);
}
</style>
