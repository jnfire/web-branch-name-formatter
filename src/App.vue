<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import BranchForm from '@/components/BranchForm.vue'
import BranchList from '@/components/BranchList.vue'
import Footer from '@/components/Footer.vue'
import { BranchManager } from '@/core/BranchManager'
import type { BranchFormType } from '@/core/BranchTypes'
import type { Branch } from '@/core/Branch'

// Instancia única de BranchManager
const branchManager = BranchManager.getInstance()

// Referencia reactiva para las ramas
const branches = ref<Branch[]>(branchManager.getBranches())

const updateBranches = () => {
  branches.value = branches.value = [...branchManager.getBranches()]
}

const handleFormSubmit = (formData: BranchFormType) => {
  branchManager.createBranch(formData)
  updateBranches()
}

const handleDeleteBranch = (branchId: number) => {
  branchManager.deleteBranch(branchId)
  updateBranches()
}
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

  <Footer />
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: var(--color-dark-blue);
  width: 100%;
  height: 10vh;
  padding: 0.5rem 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    flex-direction: column;
    height: auto;
    gap: 10px;
  }

  &__name {
    flex: 1;
    margin-right: 1rem;

    @media (max-width: 768px) {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    &__text {
      color: var(--color-beige);
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (max-width: 768px) {
        font-size: 14px;
        text-align: center;
      }
    }
  }

  &__form {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }
}

.main {
  background-color: var(--color-blue);
  width: 100%;
  min-height: calc(100vh - 10vh); /* Ajusta la altura para evitar scroll innecesario */
  padding: 0.5rem 2rem;
  margin-top: 10vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    min-height: calc(60vh - 130px);
    padding: 0.5rem 1rem;
    overflow-y: auto;
  }
}
</style>
