<script setup lang="ts">
import { ref } from 'vue'
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

<style scoped lang="sass">
.form
  display: flex
  gap: 1px
  align-items: center

  @media (max-width: 768px)
    flex-direction: column
    gap: 8px
    width: 100%

  &__input
    padding: 8px 10px
    border: 1px solid $color-dark-blue
    font-size: 14px
    background-color: $color-white
    color: $color-dark-blue
    outline: none
    transition: border-color 0.2s ease

    @media (max-width: 768px)
      padding: 12px
      font-size: 16px // Mejor para inputs móviles
      width: 100%

    &:focus
      border-color: #3498db

  &__input__project_id
    border-radius: 5px 0 0 5px

    @media (max-width: 768px)
      border-radius: 5px
      width: 100%

  &__input__ticket_id
    border-radius: 0 5px 0 0

    @media (max-width: 768px)
      border-radius: 5px
      width: 100%

  &__input__feature_name
    width: 75%

    @media (max-width: 768px)
      width: 100%
      border-radius: 5px

  &__button__generate
    padding: 8px 15px
    margin-left: 1px
    font-size: 14px
    font-weight: bold
    border: none
    border-radius: 0 5px 5px 0
    cursor: pointer
    background-color: $color-beige
    color: $color-dark-blue
    transition: background-color 0.3s ease

    @media (max-width: 768px)
      width: 100%
      padding: 8px 15px
      margin-left: 0
      border-radius: 5px
      font-size: 16px

    &:hover
      background-color: saturate($color-beige, 100%)

    &:active
      box-shadow: darken($color-beige, 60%) inset 0 1px 2px 2px
</style>
