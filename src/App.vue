<script setup lang="ts">
import BranchNameForm from '@/components/BranchNameForm.vue'
import type { BranchFormType } from '@/core/DataTypes'
import CreatedBranchList from '@/components/CreatedBranchList.vue'
import { Branch } from '@/core/Branch'
import { ref } from 'vue'

const branches = ref<Branch[]>([]);

const handleFormSubmit = (FormData: BranchFormType) => {
  console.log('Form data:', FormData);
  const newBranch = new Branch(
    {
      id: branches.length + 1,
      ticketId: FormData.ticketId,
      developName: FormData.developName,
    }
  );

  branches.value.push(newBranch);
  console.log('Branches:', branches);
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
    <CreatedBranchList :branches="branches" />
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
