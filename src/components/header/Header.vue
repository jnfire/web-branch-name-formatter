<script setup lang="ts">
import BranchNameForm from '@/components/header/BranchNameForm.vue';

const handleFormSubmit = (data: branchNameForm) => {
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
</template>

<style scoped>

</style>
