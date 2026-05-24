<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { ChevronLeft, ChevronRight } from '../../icons';

const isOpen = ref(true);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
};

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<template lang="pug">
button.sidebar-toggle.sidebar-toggle--outside(
  v-if="!isOpen",
  @click="toggle",
  aria-label="Открыть боковую панель")
  ChevronRight.toggle-icon(aria-hidden="true")

Teleport(to="body")
  Transition(name="sidebar-fade")
    .sidebar-overlay(v-if="isOpen", @click="toggle")

  Transition(name="sidebar-slide")
    aside.sidebar(v-if="isOpen", role="dialog", aria-modal="true", aria-label="Боковая панель")
      .sidebar-header
        button.sidebar-close(@click="toggle", aria-label="Закрыть боковую панель")
          ChevronLeft.toggle-icon(aria-hidden="true")

        slot(name="header")

      .sidebar-content
        slot
</template>

<style lang="scss" scoped>
.sidebar-toggle--outside {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 50;

  background: var(--background);
  border: 1px solid var(--border);
  border-left: none;
  border-radius: 0 0.75rem 0.75rem 0;
  padding: 0.75rem;

  width: 2.5rem;
  height: 2.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-100);
  }

  .toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--foreground);
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 40;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  width: var(--sidebar-width);
  max-width: 100vw;

  background: var(--background);
  border-right: 1px solid var(--border);

  z-index: 41;

  overflow-y: auto;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    width: var(--sidebar-mobile-width);
    padding: 1rem;
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.sidebar-close {
  background: transparent;
  border: none;
  cursor: pointer;

  padding: 0.5rem;
  margin: -0.5rem;

  border-radius: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background 0.2s;

  &:hover {
    background: var(--neutral-200);
  }

  &:focus-visible {
    outline: 2px solid var(--primary);
  }

  .toggle-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--foreground);
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
}

.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.25s ease;
}

.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}

.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.25s ease;
}

.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
}
</style>
