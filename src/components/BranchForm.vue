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
      class="form__input form__input__project_id"
      type="text"
      name="project-id"
      aria-label="Project ID"
      v-model="projectId"
      placeholder="Project ID"
    />
    <input
      class="form__input form__input__ticket_id"
      type="text"
      name="ticket-id"
      aria-label="Ticket name"
      v-model="ticketId"
      placeholder="Ticket ID"
    />
    <input
      class="form__input form__input__feature_name"
      type="text"
      name="develop-name"
      aria-label="Develop name"
      v-model="featureName"
      placeholder="Develop name"
    />
    <button class="form__button__generate" type="submit">Generate</button>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  gap: 1px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid var(--color-dark-blue);
    font-size: 14px;
    background-color: var(--color-white);
    color: var(--color-dark-blue);
    outline: none;
    transition: border-color 0.2s ease;

    @media (max-width: 768px) {
      flex: 1;
      width: 100%;
      padding: 12px;
      font-size: 16px;
    }

    &:focus {
      border-color: #3498db;
    }
  }

  &__input__project_id {
    flex: 2;
    max-width: 15%;
    border-radius: 5px 0 0 5px;

    @media (max-width: 768px) {
      flex: 1;
      max-width: 100%;
      border-radius: 5px;
    }
  }

  &__input__ticket_id {
    flex: 3;
    max-width: 25%;

    @media (max-width: 768px) {
      flex: 1;
      max-width: 100%;
      border-radius: 5px;
    }
  }

  &__input__feature_name {
    flex: 5;
    max-width: 60%;

    @media (max-width: 768px) {
      flex: 1;
      max-width: 100%;
      border-radius: 5px;
    }
  }

  &__button__generate {
    padding: 8px 15px;
    margin-left: 1px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    background-color: var(--color-beige);
    color: var(--color-dark-blue);
    transition: background-color 0.3s ease;

    @media (max-width: 768px) {
      width: 100%;
      padding: 8px 15px;
      margin-left: 0;
      border-radius: 5px;
      font-size: 16px;
    }

    &:hover {
      background-color: var(--color-beige);
    }

    &:active {
      box-shadow: inset 0 1px 2px 2px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
