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
    <input
      class="input-element form__input__project_id"
      type="text"
      name="project-id"
      aria-label="Project ID"
      v-model="projectId"
      placeholder="Project ID"
    />
    <input
      class="input-element form__input__ticket_id"
      type="text"
      name="ticket-id"
      aria-label="Ticket name"
      v-model="ticketId"
      placeholder="Ticket ID"
    />
    <input
      class="input-element form__input__feature_name"
      type="text"
      name="develop-name"
      aria-label="Develop name"
      v-model="featureName"
      placeholder="Develop name"
    />
    <button class="btn-primary form__button__generate" type="submit">Generate</button>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  max-width: 800px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }

  &__input__project_id {
    flex: 2;
    min-width: 120px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__input__ticket_id {
    flex: 3;
    min-width: 150px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__input__feature_name {
    flex: 5;
    min-width: 200px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__button__generate {
    flex: 1;
    min-width: 100px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>
