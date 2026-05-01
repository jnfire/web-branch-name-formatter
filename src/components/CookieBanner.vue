<template>
  <div class="cookie-banner">
    <div class="banner-content">
      <p class="message">
        🍪 We use cookies to improve the user experience. By accepting them, you help us understand
        how the site is used.
      </p>
      <div class="buttons">
        <button class="btn decline" @click="$emit('decline')">Decline</button>
        <button class="btn accept" @click="$emit('accept')">Accept</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['accept', 'decline'])
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-surface);
  color: var(--text-main);
  padding: 1rem 2rem;
  z-index: 2000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-top: 1px solid var(--border-color);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  gap: 1rem;
}

.message {
  flex-grow: 1;
  font-size: 14px;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.accept {
  background-color: var(--text-main);
  color: var(--bg-body);
}

.accept:hover {
  opacity: 0.9;
}

.decline {
  background-color: transparent;
  border: 1px solid var(--error-color);
  color: var(--error-color);
}

.decline:hover {
  background-color: var(--error-color);
  color: #fff;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    text-align: center;
  }
}
</style>