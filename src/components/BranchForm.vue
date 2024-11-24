<script setup lang="ts">
import { ref } from 'vue';
import type { BranchFormType } from '@/core/BranchTypes';

const ticketId = ref('');
const featureName = ref('');

const emit = defineEmits(['submitForm']);


const handleSubmit = (event: Event) => {
  event.preventDefault();
  emit('submitForm', { ticketId: ticketId.value, featureName: featureName.value } as BranchFormType);
};
</script>

<template>
  <form class="form" aria-label="Create branch name form" @submit="handleSubmit">
    <input class="form__input__ticket_id" type="text" name="ticket-id" aria-label="Ticket name" v-model="ticketId">
    <input class="form__input__feature_name" type="text" name="develop-name" aria-label="Develop name" v-model="featureName">
    <button class="form__button__generate" type="submit">Generate</button>
  </form>
</template>

<style scoped>

</style>