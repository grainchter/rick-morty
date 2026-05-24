<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>

<template>
  <div class="circle-icon" :style="{ backgroundColor: color }"></div>
</template>

<style scoped>
.circle-icon {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}
</style>
