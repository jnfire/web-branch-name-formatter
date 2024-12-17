<script setup lang="ts">
import { ref } from 'vue';
import type { BranchFormType } from '@/core/BranchTypes';

const ticketId = ref('');
const featureName = ref('');

const emit = defineEmits(['submitForm']);


const handleSubmit = (event: Event) => {
  event.preventDefault();

  if (!validateInput()) return;

  emit('submitForm', {
    ticketId: ticketId.value,
    featureName: featureName.value
  } as BranchFormType);

  cleanInput();
};

function validateInput() {
  return ticketId.value && featureName.value;
}

function cleanInput() {
  ticketId.value = '';
  featureName.value = '';
}
</script>

<template>
  <form class="form" aria-label="Create branch name form" @submit="handleSubmit">
    <input
        class="form__input form__input__ticket_id"
        type="text"
        name="ticket-id"
        aria-label="Ticket name"
        v-model="ticketId"
        placeholder="Ticket ID"
    >
    <input
        class="form__input form__input__feature_name"
        type="text" name="develop-name"
        aria-label="Develop name"
        v-model="featureName"
        placeholder="Develop name"
    >
    <button
        class="form__button__generate"
        type="submit"
    >Generate</button>
  </form>
</template>

<style scoped lang="sass">
.form
  display: flex
  gap: 1px
  align-items: center

  &__input
    padding: 8px 10px
    border: 1px solid $color-dark-blue
    font-size: 14px
    background-color: $color-white
    color: $color-dark-blue
    outline: none
    transition: border-color 0.2s ease

    &:focus
      border-color: #3498db

  &__input__ticket_id
    border-radius: 5px 0 0 5px
    width: 25%

  &__input__feature_name
    width: 75%

  &__button__generate
    padding: 8px 15px
    font-size: 14px
    font-weight: bold
    border: none
    border-radius: 0 5px 5px 0
    cursor: pointer
    background-color: $color-beige
    color: $color-dark-blue
    transition: background-color 0.3s ease

    &:hover
      background-color: saturate($color-beige, 100%)

    &:active
      box-shadow: darken($color-beige, 60%) inset 0 1px 2px 2px
</style>