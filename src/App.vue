<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'

import BranchForm from '@/components/BranchForm.vue'
import BranchList from '@/components/BranchList.vue'
import Footer from '@/components/Footer.vue'
import CookieBanner from '@/components/CookieBanner.vue' // Import new component
import { BranchManager } from '@/core/BranchManager'
import type { BranchFormType } from '@/core/BranchTypes'
import type { Branch } from '@/core/Branch'

// --- Cookie Consent Logic ---
const showCookieBanner = ref(false)

// This function is called when user accepts
const allowCookies = () => {
  window.gtag('consent', 'update', {
    analytics_storage: 'granted'
  })
  console.log('Cookies accepted. Consent updated.')
}

// Handlers for banner events
const handleAccept = () => {
  localStorage.setItem('cookie_consent_status', 'accepted')
  showCookieBanner.value = false
  allowCookies()
}

const handleDecline = () => {
  localStorage.setItem('cookie_consent_status', 'declined')
  showCookieBanner.value = false
}

onMounted(() => {
  const consentStatus = localStorage.getItem('cookie_consent_status')
  if (!consentStatus) {
    // If no consent is stored, show the banner
    showCookieBanner.value = true
  } else if (consentStatus === 'accepted') {
    // If consent was already given, grant it again on page load
    allowCookies()
  }
})

// --- Original Application Logic ---
const branchManager = BranchManager.getInstance()

const branches = ref<Branch[]>(branchManager.getBranches())
const filteredBranches = ref<Branch[]>([])
const hasFilterInputs = ref(false)
const showHistory = ref(false)

const updateBranches = () => {
  branches.value = [...branchManager.getBranches()]
}

const handleFormSubmit = (formData: BranchFormType) => {
  branchManager.createBranch(formData)
  updateBranches()
}

const handleDeleteBranch = (branchId: number) => {
  branchManager.deleteBranch(branchId)
  updateBranches()
}

const handleFilterChange = (filterData: {
  projectId: string
  ticketId: string
  featureName: string
}) => {
  hasFilterInputs.value =
    !!filterData.projectId || !!filterData.ticketId || !!filterData.featureName
  filteredBranches.value = hasFilterInputs.value
    ? branchManager.filterBranches({
        projectId: filterData.projectId,
        ticketId: filterData.ticketId,
        featureName: filterData.featureName
      })
    : []

  branches.value = hasFilterInputs.value
    ? branchManager
        .getBranches()
        .filter(
          (branch) =>
            !filteredBranches.value.some((filteredBranch) => filteredBranch.id === branch.id)
        )
    : branchManager.getBranches()
}
</script>

<template>
  <CookieBanner v-if="showCookieBanner" @accept="handleAccept" @decline="handleDecline" />

  <div class="app-layout">
    <header class="header">
      <div class="header__name">
        <a href="#">
          <h1 class="header__name__text">Branch Name Formatter</h1>
        </a>
      </div>
      <div class="header__form">
        <BranchForm @submitForm="handleFormSubmit" @filterChange="handleFilterChange" />
      </div>
    </header>

    <main class="main-content">
      <div class="history-toggle">
        <button class="btn-secondary" @click="showHistory = !showHistory">
          {{ showHistory ? 'Ocultar Historial' : 'Mostrar Historial' }}
        </button>
      </div>

      <div v-if="showHistory" class="history-pane">
        <BranchList
          v-if="hasFilterInputs && filteredBranches.length"
          :branches="filteredBranches"
          @deleteBranch="handleDeleteBranch"
        />
        <hr v-if="hasFilterInputs && filteredBranches.length" class="separator" />
        <BranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped lang="scss">
/* .button styles removed as they are now in CookieBanner.vue */

.header {
  margin-bottom: 2.5rem;
  text-align: center;

  &__name {
    margin-bottom: 1rem;

    &__text {
      color: var(--text-main);
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.05em;
    }
  }

  &__form {
    display: flex;
    justify-content: center;
  }
}

.history-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.history-pane {
  animation: fadeIn 0.3s ease-out;
}

.separator {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
}
</style>