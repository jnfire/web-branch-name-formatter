<script setup lang="ts">
import { ref } from 'vue'
import BranchForm from '@/components/BranchForm.vue'
import BranchList from '@/components/BranchList.vue'
import { BranchManager } from '@/core/BranchManager'
import type { BranchFormType } from '@/core/BranchTypes'
import type { Branch } from '@/core/Branch'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import { FormatManager } from '@/core/FormatManager'

const branchManager = BranchManager.getInstance()

const branches = ref<Branch[]>(branchManager.getBranches())
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

// Now handleFormSubmit receives both the template and the form data
const handleFormSubmit = (template: BranchFormatTemplate, formData: BranchFormType) => {
  // We need to update branchManager to accept template or just format it here.
  // Actually BranchManager should receive the branchName directly or the template + values.
  // For now, let's keep BranchManager API as simple as possible.
  // Wait, Branch constructor expects `BranchType` which now has `branchName`.
  
  import('@/core/BranchFormatter').then(({ BranchFormatter }) => {
    const branchName = BranchFormatter.format(template, formData)
    branchManager.createBranch({ 
      id: Date.now(), 
      branchName, 
      formatId: template.id 
    })
    updateBranches()
    latestBranch.value = branches.value[0] || null
  })
}

const handleDeleteBranch = (branchId: number) => {
  branchManager.deleteBranch(branchId)
  updateBranches()
}
</script>

<template>
  <main class="main-content">
    <div class="converter-box">
      <BranchForm @submitForm="handleFormSubmit" />
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
        <BranchList :branches="branches" @deleteBranch="handleDeleteBranch" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.converter-box {
  background-color: var(--bg-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

@media (max-width: 600px) {
  .converter-box {
    padding: 1.5rem;
  }
  .result-code {
    font-size: 1.25rem;
  }
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
</style>
