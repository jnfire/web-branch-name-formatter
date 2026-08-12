<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { BranchFormType } from '@/core/BranchTypes'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import { FormatManager } from '@/core/FormatManager'

const emit = defineEmits(['submitForm'])

const availableFormats = ref<BranchFormatTemplate[]>([])
const selectedFormatId = ref<string>('')
const formData = ref<Record<string, string>>({})

onMounted(() => {
  availableFormats.value = FormatManager.getVisibleFormats()
  if (availableFormats.value.length > 0) {
    selectedFormatId.value = availableFormats.value[0].id
  }
})

const selectedFormat = computed(() => {
  return availableFormats.value.find(f => f.id === selectedFormatId.value) || null
})

watch(selectedFormatId, () => {
  formData.value = {}
})

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (!validateInput()) return

  if (selectedFormat.value) {
    emit('submitForm', selectedFormat.value, { ...formData.value } as BranchFormType)
    cleanInput()
  }
}

function validateInput() {
  if (!selectedFormat.value) return false
  for (const field of selectedFormat.value.fields) {
    if (!formData.value[field.id]) return false
  }
  return true
}

function cleanInput() {
  formData.value = {}
}
</script>

<template>
  <form class="form" aria-label="Create branch name form" @submit="handleSubmit">
    
    <div class="form-group" v-if="availableFormats.length > 1">
      <label class="form-label">Formato</label>
      <select class="input-element select-element" v-model="selectedFormatId">
        <option v-for="format in availableFormats" :key="format.id" :value="format.id">
          {{ format.name }}
        </option>
      </select>
    </div>

    <template v-if="selectedFormat">
      <div class="form-group" v-for="field in selectedFormat.fields" :key="field.id">
        <label class="form-label">
           {{ field.label.includes('.') ? $t(field.label) : field.label }}
        </label>
        <input
          class="input-element"
          type="text"
          :name="field.id"
          v-model="formData[field.id]"
        />
      </div>
    </template>

    <button class="btn-primary generate-btn" type="submit">
      {{ $t('form.generate') }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-element {
  width: 100%;
}

.select-element {
  background-color: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  appearance: auto;
}

.generate-btn {
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
