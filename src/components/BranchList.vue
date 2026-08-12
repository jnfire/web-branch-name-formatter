<script setup lang="ts">
import BranchItem from '@/components/BranchItem.vue'
import type { Branch } from '@/core/Branch.ts'

const props = defineProps<{
  branches: Branch[]
}>()

const emit = defineEmits(['deleteBranch'])

const handleDeleteBranch = (branchId: number) => {
  emit('deleteBranch', branchId)
}
</script>

<template>
  <section class="branch_list">
    <BranchItem
      v-for="branch in props.branches"
      :key="branch.id"
      :branch-name="branch.branchName"
      :branch-id="branch.id"
      @deleteBranch="handleDeleteBranch"
    />
  </section>
</template>

<style scoped lang="scss">
.branch_list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: vars.$bp-tablet) {
  .branch_list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 0.75rem;
  }
}
</style>
