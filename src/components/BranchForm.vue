<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BranchFormType } from '@/core/BranchTypes.ts'

const projectId = ref('')
const ticketId = ref('')
const featureName = ref('')

const emit = defineEmits(['submitForm'])

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (!validateInput()) return

  emit('submitForm', {
    projectId: projectId.value,
    ticketId: ticketId.value,
    featureName: featureName.value
  } as BranchFormType)

  cleanInput()
}

function validateInput() {
  return projectId.value && ticketId.value && featureName.value
}

function cleanInput() {
  projectId.value = ''
  ticketId.value = ''
  featureName.value = ''
}
</script>

<template>
  <form class="form" aria-label="Create branch name form" @submit="handleSubmit">
    <div class="form-group">
      <label class="form-label">{{ $t('form.projectId') }}</label>
      <input
        class="input-element"
        type="text"
        name="project-id"
        v-model="projectId"
        :placeholder="$t('form.projectIdPlaceholder')"
      />
    </div>

    <div class="form-group">
      <label class="form-label">{{ $t('form.ticketId') }}</label>
      <input
        class="input-element"
        type="text"
        name="ticket-id"
        v-model="ticketId"
        :placeholder="$t('form.ticketIdPlaceholder')"
      />
    </div>

    <div class="form-group">
      <label class="form-label">{{ $t('form.developName') }}</label>
      <input
        class="input-element"
        type="text"
        name="develop-name"
        v-model="featureName"
        :placeholder="$t('form.developNamePlaceholder')"
      />
    </div>

    <button class="btn-primary generate-btn" type="submit">
      {{ $t('form.generate') }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-element {
  width: 100%;
}

.generate-btn {
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
