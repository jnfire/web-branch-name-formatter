<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BranchFormatTemplate, Capitalization, FieldDefinition, LanguageProfile } from '@/core/FormatTypes'
import CustomSelect from '@/components/CustomSelect.vue'

const props = defineProps<{
  format: BranchFormatTemplate
}>()

const emit = defineEmits(['save', 'cancel', 'update:format', 'toggle-visibility'])

const localFormat = ref<BranchFormatTemplate>(JSON.parse(JSON.stringify(props.format)))

const capitalizationOptions: { value: Capitalization; label: string }[] = [
  { value: 'UPPERCASE', label: 'Mayúsculas' },
  { value: 'LOWERCASE', label: 'Minúsculas' },
  { value: 'AS_IS', label: 'Tal cual' }
]

const languageOptions: { value: LanguageProfile; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' }
]

watch(() => props.format, (newFormat) => {
  localFormat.value = JSON.parse(JSON.stringify(newFormat))
}, { deep: true })

watch(localFormat, (newVal) => {
  emit('update:format', newVal)
}, { deep: true })

const addField = () => {
  const newId = `campo${localFormat.value.fields.length + 1}`
  localFormat.value.fields.push({
    id: newId,
    label: `Nuevo Campo`,
    capitalization: 'AS_IS',
    type: 'text'
  })
}

const removeField = (index: number) => {
  localFormat.value.fields.splice(index, 1)
}

const handleSave = () => {
  emit('save', localFormat.value)
}

const updateOptions = (field: FieldDefinition, event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  field.options = val.split(',').map(s => s.trim()).filter(Boolean);
}
</script>

<template>
  <div class="editor">
    <div class="status-section">
      <button
        type="button"
        class="switch"
        :class="{ 'switch--on': format.isVisible }"
        role="switch"
        :aria-checked="format.isVisible"
        @click="emit('toggle-visibility')"
      >
        <span class="switch-track"><span class="switch-thumb"></span></span>
        <span class="switch-label">{{ format.isVisible ? 'Activado' : 'Desactivado' }}</span>
      </button>
      <p class="switch-hint">
        {{ format.isVisible
          ? 'Este formato aparece como opción en el formulario principal.'
          : 'Este formato está oculto: no aparecerá como opción en el formulario principal.' }}
      </p>
    </div>

    <p v-if="format.isReadonly" class="readonly-hint">
      Este formato viene incluido en la app y no se puede modificar. Para personalizarlo, clónalo desde la lista y edita la copia.
    </p>

    <div class="form-group">
      <label class="form-label">Nombre del formato</label>
      <input type="text" v-model="localFormat.name" class="input-element" :disabled="format.isReadonly" />
    </div>

    <div class="form-group">
      <label class="form-label">Plantilla (Usa {id} para inyectar campos)</label>
      <input type="text" v-model="localFormat.templateString" class="input-element" :disabled="format.isReadonly" />
    </div>

    <div class="form-group">
      <label class="form-label">Idioma (saneado de caracteres: ñ, /, tildes...)</label>
      <CustomSelect v-model="localFormat.language" :options="languageOptions" :disabled="format.isReadonly" />
    </div>

    <div class="fields-section">
      <h4 class="form-label">Campos</h4>
      <div v-for="(field, index) in localFormat.fields" :key="index" class="field-editor">
        <div class="field-editor-head">
          <span class="field-index">Campo {{ index + 1 }}</span>
          <button v-if="!format.isReadonly" @click="removeField(index)" class="icon-btn delete-btn" title="Eliminar campo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>

        <div class="field-header">
          <div class="field-control">
            <label class="field-label-small">ID del Campo</label>
            <input type="text" v-model="field.id" placeholder="ej: ticketId" class="input-element small" :disabled="format.isReadonly" />
          </div>

          <div class="field-control">
            <label class="field-label-small">Nombre del Campo</label>
            <input type="text" v-model="field.label" placeholder="ej: ID Ticket" class="input-element small" :disabled="format.isReadonly" />
          </div>

          <div class="field-control type-select">
            <label class="field-label-small">Tipo</label>
            <CustomSelect
              v-model="field.type"
              size="sm"
              :disabled="format.isReadonly"
              :options="[{value: 'text', label: 'Texto Libre'}, {value: 'select', label: 'Selector'}]"
            />
          </div>

          <div class="field-control type-select">
            <label class="field-label-small">Capitalización</label>
            <CustomSelect
              v-model="field.capitalization"
              size="sm"
              :disabled="format.isReadonly"
              :options="capitalizationOptions"
            />
          </div>
        </div>

        <div v-if="field.type === 'select'" class="field-options-control">
          <label class="field-label-small">Opciones (separadas por comas)</label>
          <input
            type="text"
            :value="(field.options || []).join(', ')"
            @input="updateOptions(field, $event)"
            placeholder="ej: feature, fix, hotfix"
            class="input-element small"
            :disabled="format.isReadonly"
          />
        </div>
      </div>
      <button v-if="!format.isReadonly" @click="addField" class="btn-secondary">+ Añadir Campo</button>
    </div>

    <div class="actions">
      <button v-if="format.isReadonly" @click="emit('cancel')" class="btn-secondary">Cerrar</button>
      <template v-else>
        <button @click="emit('cancel')" class="btn-secondary">Cancelar</button>
        <button @click="handleSave" class="btn-primary">Guardar</button>
      </template>
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

.status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.switch-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.switch {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-main);
  font-family: inherit;
}

.switch-track {
  position: relative;
  width: 38px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: var(--border-color);
  transition: background-color 0.2s ease;
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--bg-body);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.switch--on .switch-track {
  background-color: var(--accent-color);
}

.switch--on .switch-thumb {
  transform: translateX(16px);
}

@media (prefers-reduced-motion: reduce) {
  .switch-track,
  .switch-thumb {
    transition: none;
  }
}

.readonly-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-top: -0.5rem;
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
    padding: vars.$control-padding-y-sm vars.$control-padding-x-sm;
    font-size: vars.$control-font-size-sm;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    background-color: var(--bg-surface);
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

.field-editor-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.field-index {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: flex-end;
}

.field-control {
  flex: 1 1 160px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-options-control {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
  background-color: var(--bg-body);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px dashed var(--border-color);
}

.field-label-small {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.delete-btn {
  color: var(--error-color);
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

@media (max-width: vars.$bp-mobile) {
  .field-header {
    flex-direction: column;
    align-items: stretch;
  }
  .field-control {
    flex-basis: auto;
  }
}
</style>
