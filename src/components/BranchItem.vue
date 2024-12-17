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
      <button class="branch__button branch__button__copy" @click="copyToClipboard">Copy</button>
      <button class="branch__button branch__button__delete" @click="deleteBranch">Delete</button>
    </div>
  </div>
</template>

<style scoped lang="sass">
.branch
  display: flex
  justify-content: space-between
  align-items: center
  background-color: $color-dark-blue
  border-radius: 8px
  padding: 10px 20px
  margin: 0.5rem
  color: $color-beige
  font-family: Arial, sans-serif
  font-size: 16px
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2)

  &__name
    flex: 1
    min-width: 0

    &__text
      font-weight: bold
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      max-width: 90%

  &__buttons
    display: flex
    gap: 0

  &__button
    padding: 8px 15px
    font-size: 14px
    font-weight: bold
    border: none
    cursor: pointer
    transition: box-shadow 0.1s ease

    &__copy
      border-radius: 5px 0 0 5px
      margin-right: 2px
      background-color: $color-beige
      color: $color-dark-blue

      &:hover
        background-color: saturate($color-beige, 100%)

      &:active
        box-shadow: darken($color-beige, 60%) inset 0 1px 2px 2px

    &__delete
      border-radius: 0 5px 5px 0
      margin-left: 1px
      background-color: $color-red
      color: $color-dark-blue

      &:hover
        background-color: saturate($color-red, 20%)

      &:active
        box-shadow: darken($color-red, 40%) inset 0 1px 2px 2px
</style>