<script setup lang="ts">
import { ref } from 'vue';
import type { BranchFormType } from '@/core/DataTypes';

const ticketId = ref('');
const developName = ref('');

const emit = defineEmits(['submitForm']);


const handleSubmit = (event: Event) => {
  event.preventDefault();
  emit('submitForm', { ticketId: ticketId.value, developName: developName.value } as BranchFormType);
};
</script>

<template>
  <form aria-label="Create branch name form" @submit="handleSubmit">
    <input type="text" name="ticket-id" aria-label="Ticket name" v-model="ticketId">
    <input type="text" name="develop-name" aria-label="Develop name" v-model="developName">
    <button type="submit">Generate</button>
  </form>
</template>

<style scoped>

</style>