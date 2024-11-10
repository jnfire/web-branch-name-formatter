<script setup lang="ts">
const props = defineProps<{
  branchName: string;
}>();
</script>

<template>
  <div>
    <p>{{ props.branchName }}</p>
    <div>
      <button>Copy</button>
      <button>Delete</button>
    </div>
  </div>
</template>

<style scoped>
</style>