<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import BranchForm from '@/components/BranchForm.vue';
import BranchList from '@/components/BranchList.vue';
import { BranchManager } from '@/core/BranchManager';
import type { BranchFormType } from '@/core/BranchTypes';
import type { Branch } from '@/core/Branch';

// Instancia única de BranchManager
const branchManager = new BranchManager();

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
      <h1 class="header__name__text">V01-branch-name-generator</h1>
    </div>
    <div class="header__form">
      <BranchForm @submitForm="handleFormSubmit" />
    </div>
  </header>

  <main class="main">
    <BranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
  </main>
</template>

<style scoped>

</style>