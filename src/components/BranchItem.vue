<script setup lang="ts">
const props = defineProps<{
  branchName: string;
  branchId: number;
}>();

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.branchName);
};

const emit = defineEmits(['deleteBranch']);

const deleteBranch = () => {
  emit('deleteBranch', props.branchId);
};
</script>

<template>
  <div>
    <p>{{ props.branchName }}</p>
    <div>
      <button @click="copyToClipboard">Copy</button>
      <button @click="deleteBranch">Delete</button>
    </div>
  </div>
</template>

<style scoped>
</style>