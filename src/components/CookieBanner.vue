<template>
  <div class="cookie-banner">
    <div class="banner-content">
      <p class="message">
        🍪 Usamos cookies para mejorar la experiencia de usuario. Al aceptarlas, nos ayudas a
        entender cómo se usa el sitio.
      </p>
      <div class="buttons">
        <button class="btn decline" @click="$emit('decline')">Rechazar</button>
        <button class="btn accept" @click="$emit('accept')">Aceptar</button>
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
  background-color: var(--color-dark-blue);
  color: var(--color-beige);
  padding: 1rem 2rem;
  z-index: 2000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  border-top: 1px solid var(--color-blue);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
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
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.accept {
  background-color: var(--color-blue);
  color: var(--color-white);
}

.accept:hover {
  background-color: #0a5a7d; /* A slightly lighter shade of --color-blue */
}

.decline {
  background-color: transparent;
  border: 1px solid var(--color-red);
  color: var(--color-red);
}

.decline:hover {
  background-color: var(--color-red);
  color: var(--color-white);
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