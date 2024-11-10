<script setup lang="ts">
import BranchNameForm from '@/components/BranchNameForm.vue'
import type { BranchNameFormType } from '@/core/DataTypes'

const handleFormSubmit = (data: BranchNameFormType) => {
  console.log('Form data:', data);
  // Aquí puedes manejar los datos como desees
};
</script>

<template>
  <header>
    <div>
      <h1>V01-branch-name-generator</h1>
    </div>
    <div>
      <BranchNameForm @submitForm="handleFormSubmit" />
    </div>
  </header>

  <main>

  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    background-color: red;
    display: flex;
    flex-direction: column;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
