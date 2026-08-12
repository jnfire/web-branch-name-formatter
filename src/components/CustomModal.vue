<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const handleClose = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const handleConfirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (props.modelValue && e.key === 'Escape') {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <transition name="modal-fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content" role="dialog" aria-modal="true" :aria-labelledby="'modal-title'">
        <h3 id="modal-title" class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        
        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="handleClose">
            {{ cancelText || $t('common.cancel') }}
          </button>
          <button
            type="button"
            :class="danger ? 'btn-danger' : 'btn-primary'"
            @click="handleConfirm"
          >
            {{ confirmText || $t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: var(--bg-surface);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.modal-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-main);
}

.modal-message {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
