<script setup lang="ts">
import CreatedBranchItem from '@/components/CreatedBranchItem.vue';
import type { Branch } from '@/core/Branch'

const props = defineProps<{
  branches: Branch[];
}>();
</script>

<template>
  <section>
    <CreatedBranchItem v-for="branch in props.branches" :key="branch.id" :branch-name="branch.branchName" />
  </section>
</template>

<style scoped>

</style>