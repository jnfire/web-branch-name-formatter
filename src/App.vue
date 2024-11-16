<script setup lang="ts">
import BranchForm from '@/components/BranchForm.vue';
import type { BranchFormType } from '@/core/BranchTypes';
import BranchList from '@/components/BranchList.vue';
import { Branch } from '@/core/Branch';
import { ref } from 'vue';

const branches = ref<Branch[]>([]);

const handleFormSubmit = (FormData: BranchFormType) => {
  const newBranch = new Branch({
    id: branches.value.length + 1,
    ticketId: FormData.ticketId,
    featureName: FormData.featureName,
  });
  branches.value.push(newBranch);
};

const handleDeleteBranch = (branchId: number) => {
  branches.value = branches.value.filter(branch => branch.id !== branchId);
};
</script>

<template>
  <header>
    <div>
      <h1>V01-branch-name-generator</h1>
    </div>
    <div>
      <BranchForm @submitForm="handleFormSubmit" />
    </div>
  </header>

  <main>
    <BranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
  </main>
</template>

<style scoped lang="sass">

</style>