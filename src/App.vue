<script setup lang="ts">
import BranchNameForm from '@/components/BranchNameForm.vue';
import type { BranchFormType } from '@/core/DataTypes';
import CreatedBranchList from '@/components/CreatedBranchList.vue';
import { Branch } from '@/core/Branch';
import { ref } from 'vue';

const branches = ref<Branch[]>([]);

const handleFormSubmit = (FormData: BranchFormType) => {
  const newBranch = new Branch({
    id: branches.value.length + 1,
    ticketId: FormData.ticketId,
    developName: FormData.developName,
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
      <BranchNameForm @submitForm="handleFormSubmit" />
    </div>
  </header>

  <main>
    <CreatedBranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
  </main>
</template>

<style scoped>

</style>