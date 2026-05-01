<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'

import BranchForm from '@/components/BranchForm.vue'
import BranchList from '@/components/BranchList.vue'
import Footer from '@/components/Footer.vue'
import { BranchManager } from '@/core/BranchManager'
import type { BranchFormType } from '@/core/BranchTypes'
import type { Branch } from '@/core/Branch'

// --- Original Application Logic ---
const branchManager = BranchManager.getInstance()

const branches = ref<Branch[]>(branchManager.getBranches())
const filteredBranches = ref<Branch[]>([])
const hasFilterInputs = ref(false)
const showHistory = ref(false)
const latestBranch = ref<Branch | null>(null)
const copied = ref(false)

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const updateBranches = () => {
  branches.value = [...branchManager.getBranches()]
}

const handleFormSubmit = (formData: BranchFormType) => {
  branchManager.createBranch(formData)
  updateBranches()
  latestBranch.value = branches.value[0] || null
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
  <div class="app-layout">
    <header class="hero">
      <div class="lang-switcher">
        <button class="lang-btn" :class="{ active: $i18n.locale === 'es' }" @click="$i18n.locale = 'es'">ES</button>
        <span class="lang-divider">|</span>
        <button class="lang-btn" :class="{ active: $i18n.locale === 'en' }" @click="$i18n.locale = 'en'">EN</button>
      </div>
      <h1 class="hero__title">{{ $t('hero.title') }}</h1>
      <p class="hero__subtitle">
        {{ $t('hero.subtitle') }}
      </p>
      <div class="badges">
        <span class="badge">{{ $t('hero.badges.openSource') }}</span>
        <span class="badge">{{ $t('hero.badges.privacyFirst') }}</span>
        <span class="badge">{{ $t('hero.badges.localOnly') }}</span>
      </div>
    </header>

    <main class="main-content">
      <div class="converter-box">
        <BranchForm @submitForm="handleFormSubmit" @filterChange="handleFilterChange" />
      </div>

      <div v-if="latestBranch" class="result-section">
        <h2 class="result-title">{{ $t('result.title') }}</h2>
        <div class="result-card">
          <code class="result-code">{{ latestBranch.branchName }}</code>
          <button class="btn-primary" @click="copyToClipboard(latestBranch.branchName)">
            {{ copied ? $t('result.copied') : $t('result.copy') }}
          </button>
        </div>
      </div>

      <div class="history-section">
        <div class="history-header">
          <button class="btn-secondary toggle-btn" @click="showHistory = !showHistory">
            {{ showHistory ? $t('history.hide') : $t('history.show') }}
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
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped lang="scss">
.lang-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.lang-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  transition: color 0.2s;

  &:hover {
    color: var(--text-main);
  }

  &.active {
    color: var(--text-main);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
}

.lang-divider {
  color: var(--border-color);
  font-size: 0.7rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;

  &__title {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }
}

.badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background-color: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.converter-box {
  background-color: var(--bg-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.result-section {
  animation: fadeIn 0.3s ease-out;
  margin-bottom: 3rem;
}

.result-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.result-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.result-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-main);
  word-break: break-all;
  text-align: center;
}

.history-section {
  margin-top: 4rem;
}

.history-header {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.history-pane {
  animation: fadeIn 0.3s ease-out;
}

.separator {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
}
</style>