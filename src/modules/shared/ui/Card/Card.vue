<script setup lang="ts">
interface InfoItem {
  id: string | number;
  title: string;
  description: string;
}

interface Props {
  imgURL: string;
  title: string;
  infoList: InfoItem[];
}

defineProps<Props>();
</script>

<template lang="pug">
.card
  .card__image-wrapper
    img.card__image(:src="imgURL", :alt="title", loading="lazy")
    .card__gradient

    .card__status-badge
      slot(name="badge")

  .card__content
    h3.card__title {{ title }}

    dl.card__info-row(v-for="item in infoList", :key="item.id || item.title")
      dt.card__info-label {{ item.title }}
      dd.card__info-value {{ item.description }}
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  background-color: var(--card);
  border-radius: 1rem;
  border: 1px solid var(--neutral-200);
  overflow: hidden;
  width: 280px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.3s forwards;
  will-change: transform;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--neutral-300);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &__image-wrapper {
    position: relative;
    height: 14rem;
    overflow: hidden;
    background-color: var(--neutral-200);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
  }

  &__content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--neutral-800);
    letter-spacing: -0.025em;
  }

  &__info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }

  &__info-label {
    text-align: end;
    color: var(--neutral-600);
  }

  &__info-value {
    text-align: end;
    color: var(--neutral-800);
    font-weight: 500;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
