<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BranchFormatTemplate, FieldDefinition, FormatOperation } from '@/core/FormatTypes'

const props = defineProps<{
  format: BranchFormatTemplate
}>()

const emit = defineEmits(['save', 'cancel'])

const localFormat = ref<BranchFormatTemplate>(JSON.parse(JSON.stringify(props.format)))

const availableOperations: { value: FormatOperation; label: string }[] = [
  { value: 'UPPERCASE', label: 'Mayúsculas' },
  { value: 'LOWERCASE', label: 'Minúsculas' },
  { value: 'REPLACE_SLASHES', label: 'Reemplazar "/" por "-o-"' },
  { value: 'REPLACE_DOTS', label: 'Reemplazar "." por "-"' },
  { value: 'REPLACE_SPACES', label: 'Reemplazar espacios por "-"' },
  { value: 'REMOVE_MULTIPLE_DASHES', label: 'Quitar guiones múltiples' },
  { value: 'SET_NY', label: 'Cambiar "ñ" por "ny"' },
  { value: 'REMOVE_ACCENTS', label: 'Quitar tildes' },
  { value: 'REMOVE_SPECIAL_CHARS', label: 'Quitar caracteres especiales' },
  { value: 'BASIC_CLEAN', label: 'Limpieza Básica' },
]

watch(() => props.format, (newFormat) => {
  localFormat.value = JSON.parse(JSON.stringify(newFormat))
}, { deep: true })

// Actualizamos la prop 'format' original si cambia localFormat (para previsualización en vivo)
// No mutamos props, emitimos un update o el padre le pasa el mismo ref que está editando.
// En este caso, emitiremos update:format para que el padre actualice la previsualización
watch(localFormat, (newVal) => {
  emit('update:format', newVal)
}, { deep: true })

const addField = () => {
  const newId = `campo${localFormat.value.fields.length + 1}`
  localFormat.value.fields.push({
    id: newId,
    label: `Nuevo Campo`,
    operations: []
  })
}

const removeField = (index: number) => {
  localFormat.value.fields.splice(index, 1)
}

const handleSave = () => {
  emit('save', localFormat.value)
}

const toggleOperation = (field: FieldDefinition, op: FormatOperation) => {
  const index = field.operations.indexOf(op)
  if (index === -1) {
    field.operations.push(op)
  } else {
    field.operations.splice(index, 1)
  }
}
</script>

<template>
  <div class="editor">
    <div class="form-group">
      <label class="form-label">Nombre del formato</label>
      <input type="text" v-model="localFormat.name" class="input-element" />
    </div>
    
    <div class="form-group">
      <label class="form-label">Plantilla (Usa {id} para inyectar campos)</label>
      <input type="text" v-model="localFormat.templateString" class="input-element" />
    </div>

    <div class="fields-section">
      <h4 class="form-label">Campos</h4>
      <div v-for="(field, index) in localFormat.fields" :key="index" class="field-editor">
        <div class="field-header">
          <input type="text" v-model="field.id" placeholder="ID (ej: ticketId)" class="input-element small" />
          <input type="text" v-model="field.label" placeholder="Etiqueta UI" class="input-element small" />
          <button @click="removeField(index)" class="btn-secondary small-btn" title="Eliminar campo">X</button>
        </div>
        <div class="operations-list">
          <label v-for="op in availableOperations" :key="op.value" class="op-label">
            <input 
              type="checkbox" 
              :checked="field.operations.includes(op.value)"
              @change="toggleOperation(field, op.value)"
            />
            {{ op.label }}
          </label>
        </div>
      </div>
      <button @click="addField" class="btn-secondary">+ Añadir Campo</button>
    </div>

    <div class="actions">
      <button @click="emit('cancel')" class="btn-secondary">Cancelar</button>
      <button @click="handleSave" class="btn-primary">Guardar</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  &.small {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}

.fields-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.field-editor {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.field-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.small-btn {
  padding: 0 0.75rem;
}

.operations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.op-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-main);
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
