<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BranchFormType } from '@/core/BranchTypes.ts'

const projectId = ref('')
const ticketId = ref('')
const featureName = ref('')

const emit = defineEmits(['submitForm', 'filterChange'])

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

watch([projectId, ticketId, featureName], () => {
  emit('filterChange', {
    projectId: projectId.value,
    ticketId: ticketId.value,
    featureName: featureName.value
  })
})
</script>

<template>
  <form class="form" aria-label="Create branch name form" @submit="handleSubmit">
    <div class="form-group">
      <label class="form-label">Project ID</label>
      <input
        class="input-element"
        type="text"
        name="project-id"
        v-model="projectId"
        placeholder="e.g. WEB"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Ticket ID</label>
      <input
        class="input-element"
        type="text"
        name="ticket-id"
        v-model="ticketId"
        placeholder="e.g. 1234"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Develop Name</label>
      <input
        class="input-element"
        type="text"
        name="develop-name"
        v-model="featureName"
        placeholder="e.g. add-login-form"
      />
    </div>

    <button class="btn-primary generate-btn" type="submit">
      Generate Branch Name
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
