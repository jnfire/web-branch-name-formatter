<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits<{
  (e: 'accept'): void;
}>();

const visible = ref(false);

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent');
  if (consent === 'granted') {
    emit('accept');
  } else if (!consent) {
    // Show banner after a short delay for smoothness
    setTimeout(() => {
      visible.value = true;
    }, 1000);
  }
});

const handleAccept = () => {
  localStorage.setItem('cookie-consent', 'granted');
  visible.value = false;
  emit('accept');
};

const handleDecline = () => {
  localStorage.setItem('cookie-consent', 'denied');
  visible.value = false;
};
</script>

<template>
  <transition name="slide-up">
    <div 
      v-if="visible" 
      class="cookie-banner"
      role="region"
      :aria-label="t('cookies.text')"
      aria-describedby="cookie-banner-text"
    >
      <div class="cookie-banner__content">
        <p id="cookie-banner-text" class="cookie-banner__text">{{ t('cookies.text') }}</p>
        <div class="cookie-banner__actions">
          <button type="button" class="btn-decline" @click="handleDecline">
            {{ t('cookies.decline') }}
          </button>
          <button type="button" class="btn-accept" @click="handleAccept">
            {{ t('cookies.accept') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 550px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  z-index: 9999;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: vars.$bp-mobile) {
    &__content {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  &__text {
    color: var(--text-main);
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    flex-shrink: 0;
  }
}

button {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
}

.btn-decline {
  background-color: transparent;
  color: var(--text-muted);
  border-color: var(--border-color);

  &:hover {
    background-color: var(--bg-surface-hover);
    color: var(--text-main);
  }
}

.btn-accept {
  background-color: var(--accent-color, #000);
  color: var(--bg-body, #fff);

  &:hover {
    opacity: 0.9;
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 2rem);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 2rem);
}
</style>
