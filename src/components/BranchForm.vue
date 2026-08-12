<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BranchFormType } from '@/core/BranchTypes'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import { FormatManager } from '@/core/FormatManager'
import CustomSelect from '@/components/CustomSelect.vue'

const emit = defineEmits(['submitForm'])

const { t } = useI18n()

const availableFormats = ref<BranchFormatTemplate[]>([])
const selectedFormatId = ref<string>('')
const formData = ref<Record<string, string>>({})

onMounted(() => {
  availableFormats.value = FormatManager.getVisibleFormats()
  if (availableFormats.value.length > 0) {
    const defaultId = FormatManager.getDefaultFormatId()
    const defaultStillAvailable = availableFormats.value.some(f => f.id === defaultId)
    selectedFormatId.value = defaultStillAvailable ? defaultId! : availableFormats.value[0].id
  }
})

const selectedFormat = computed(() => {
  return availableFormats.value.find(f => f.id === selectedFormatId.value) || null
})

const formatOptions = computed(() => {
  return availableFormats.value.map(f => ({ value: f.id, label: f.name.includes('.') ? t(f.name) : f.name }))
})

watch(selectedFormatId, () => {
  formData.value = {}
  // Initialize default values for select fields
  if (selectedFormat.value) {
    selectedFormat.value.fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        formData.value[field.id] = field.options[0]
      }
    })
  }
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
  // Re-initialize default values for select fields
  if (selectedFormat.value) {
    selectedFormat.value.fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        formData.value[field.id] = field.options[0]
      }
    })
  }
}
</script>

<template>
  <form class="form" :aria-label="$t('form.generate')" @submit="handleSubmit">
    
    <div class="form-group" v-if="availableFormats.length > 1">
      <label class="form-label">{{ $t('form.formatLabel') }}</label>
      <CustomSelect 
        v-model="selectedFormatId" 
        :options="formatOptions" 
      />
    </div>

    <template v-if="selectedFormat">
      <div class="form-group" v-for="field in selectedFormat.fields" :key="field.id">
        <label class="form-label">
           {{ field.label.includes('.') ? $t(field.label) : field.label }}
        </label>
        
        <CustomSelect
          v-if="field.type === 'select' && field.options"
          v-model="formData[field.id]"
          :options="field.options.map(opt => ({ value: opt, label: opt }))"
          :name="field.id"
        />
        <input
          v-else
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

.generate-btn {
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
