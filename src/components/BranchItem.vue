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
  <div class="branch">
    <div class="branch__name">
      <p class="branch__name__text">{{ props.branchName }}</p>
    </div>
    <div class="branch__buttons">
      <button class="branch__button__copy" @click="copyToClipboard">Copy</button>
      <button class="branch__button__delete" @click="deleteBranch">Delete</button>
    </div>
  </div>
</template>

<style scoped>
</style>