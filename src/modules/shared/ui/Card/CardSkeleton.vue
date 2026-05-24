<template lang="pug">
.card-skeleton
  .card-skeleton__image
  .card-skeleton__content
    .card-skeleton__title
    .card-skeleton__info
      .card-skeleton__row
        .skeleton-line.skeleton-line--small
        .skeleton-line.skeleton-line--medium
      .card-skeleton__row
        .skeleton-line.skeleton-line--small
        .skeleton-line.skeleton-line--large
</template>

<style lang="scss" scoped>
.card-skeleton {
  width: 280px;
  background-color: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  opacity: 1;
  transform: none;
  transition: none;

  &__image {
    height: 14rem;
    background-color: #e5e5e5;
  }

  &__content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__title {
    height: 1.5rem;
    width: 75%;
    background-color: #e5e5e5;
    border-radius: 0.5rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.skeleton-line {
  height: 1rem;
  background-color: #e5e5e5;
  border-radius: 0.25rem;

  &--small {
    width: 4rem;
  }
  &--medium {
    width: 5rem;
  }
  &--large {
    width: 8rem;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.card-skeleton__image,
.card-skeleton__title,
.skeleton-line {
  animation: shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
