<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import BranchForm from '@/components/BranchForm.vue';
import BranchList from '@/components/BranchList.vue';
import { BranchManager } from '@/core/BranchManager';
import type { BranchFormType } from '@/core/BranchTypes';
import type { Branch } from '@/core/Branch';

// Instancia única de BranchManager
const branchManager = BranchManager.getInstance();

// Referencia reactiva para las ramas
const branches = ref<Branch[]>(branchManager.getBranches());

const updateBranches = () => {
  branches.value = branches.value = [...branchManager.getBranches()];
};

const handleFormSubmit = (formData: BranchFormType) => {
  branchManager.createBranch(formData);
  updateBranches();
};

const handleDeleteBranch = (branchId: number) => {
  branchManager.deleteBranch(branchId);
  updateBranches();
};
</script>

<template>
  <header class="header">
    <div class="header__name">
      <a href="#">
        <h1 class="header__name__text">V01-branch-name-generator</h1>
      </a>
    </div>
    <div class="header__form">
      <BranchForm @submitForm="handleFormSubmit" />
    </div>
  </header>

  <main class="main">
    <BranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
  </main>
</template>

<style scoped lang="sass">
.header
  background-color: $color-dark-blue
  width: 100%
  height: 10vh
  padding: 0.5rem 3.5rem
  display: flex
  justify-content: space-between
  align-items: center

  &__name
    flex: 1

    &__text
      color: $color-beige
      font-size: 16px
      font-weight: bold
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap

  &__form
    display: flex
    align-items: center

.main
  background-color: $color-blue
  width: 100%
  height: 90vh
  padding: 0.5rem 2rem
</style>