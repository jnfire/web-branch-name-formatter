<!-- src/components/LangSelector.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: string;
  options: { code: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const currentLabel = computed(() => {
  const found = props.options.find(opt => opt.code === props.modelValue);
  return found ? found.label : props.modelValue;
});

const selectOption = (code: string) => {
  emit('update:modelValue', code);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="lang-selector-container" ref="containerRef">
    <button 
      type="button" 
      class="lang-selector-trigger" 
      @click="isOpen = !isOpen"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span class="lang-label">{{ currentLabel }}</span>
      <span class="dropdown-arrow" :class="{ 'arrow-open': isOpen }">▾</span>
    </button>

    <transition name="fade-slide">
      <ul v-if="isOpen" class="lang-selector-dropdown" role="listbox">
        <li 
          v-for="opt in options" 
          :key="opt.code"
          class="lang-option"
          :class="{ 'option-selected': opt.code === modelValue }"
          role="option"
          :aria-selected="opt.code === modelValue"
          @click="selectOption(opt.code)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.lang-selector-container {
  position: relative;
  display: inline-block;
}

.lang-selector-trigger {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
  user-select: none;
}

.lang-selector-trigger:hover {
  background: var(--bg-surface-hover);
  border-color: var(--accent-color);
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.arrow-open {
  transform: rotate(180deg);
}

.lang-selector-dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
  padding: 0.35rem 0;
  min-width: 80px;
  list-style: none;
  z-index: 2000;
  margin: 0;
}

.lang-option {
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  cursor: pointer;
  transition: background-color 0.15s;
  text-align: center;
}

.lang-option:hover {
  background-color: var(--bg-surface-hover);
}

.option-selected {
  background-color: var(--accent-color);
  color: var(--bg-body);
}

.option-selected:hover {
  background-color: var(--accent-color);
  color: var(--bg-body);
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
