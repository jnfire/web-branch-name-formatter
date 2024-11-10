<script setup lang="ts">
import CreatedBranchItem from '@/components/CreatedBranchItem.vue';
import type { Branch } from '@/core/Branch';

const props = defineProps<{
  branches: Branch[];
}>();

const emit = defineEmits(['deleteBranch']);

const handleDeleteBranch = (branchId: number) => {
  emit('deleteBranch', branchId);
};
</script>

<template>
  <section>
    <CreatedBranchItem
      v-for="branch in props.branches"
      :key="branch.id"
      :branch-name="branch.branchName"
      :branch-id="branch.id"
      @deleteBranch="handleDeleteBranch"
    />
  </section>
</template>

<style scoped>
</style>