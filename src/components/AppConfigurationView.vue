<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FormatManager } from '@/core/FormatManager'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import FormatPreview from '@/components/FormatPreview.vue'
import FormatEditor from '@/components/FormatEditor.vue'
import CustomModal from '@/components/CustomModal.vue'
import ArrowLeftIcon from '@/components/ArrowLeftIcon.vue'

const emit = defineEmits(['close'])

const formats = ref<BranchFormatTemplate[]>([])
const editingFormat = ref<BranchFormatTemplate | null>(null)
const previewFormat = ref<BranchFormatTemplate | null>(null)
const defaultFormatId = ref<string | null>(null)

const showDeleteModal = ref(false)
const formatToDelete = ref<string | null>(null)

const loadFormats = () => {
  formats.value = FormatManager.getFormats()
}

onMounted(() => {
  loadFormats()
  if (formats.value.length > 0) {
    const storedDefaultId = FormatManager.getDefaultFormatId()
    const storedDefault = formats.value.find(f => f.id === storedDefaultId)
    previewFormat.value = storedDefault || formats.value[0]
    defaultFormatId.value = previewFormat.value.id
  }
})

// Devuelve el formato que debe verse en la previsualización cuando no hay uno
// explícito que mostrar (tras cerrar el editor, borrar, etc.): el predeterminado
// actual si sigue existiendo, o si no el primero de la lista.
const getPreviewFallback = (): BranchFormatTemplate | null => {
  return formats.value.find(f => f.id === defaultFormatId.value) || formats.value[0] || null
}

// Al hacer clic en una tarjeta se previsualiza y, a la vez, se marca como
// el formato predeterminado de la app.
const selectFormat = (format: BranchFormatTemplate) => {
  previewFormat.value = format
  defaultFormatId.value = format.id
  FormatManager.setDefaultFormatId(format.id)
}

const handleEdit = (format: BranchFormatTemplate) => {
  editingFormat.value = format
  previewFormat.value = format
}

const handleClone = (formatId: string) => {
  const cloned = FormatManager.cloneFormat(formatId)
  if (cloned) {
    loadFormats()
    handleEdit(cloned)
  }
}

const handleToggleVisibilityInEditor = () => {
  if (!editingFormat.value) return
  const { id, isVisible } = editingFormat.value
  FormatManager.setVisibility(id, !isVisible)

  // Un formato oculto no puede seguir siendo el predeterminado de la app.
  if (defaultFormatId.value === id && isVisible) {
    loadFormats()
    defaultFormatId.value = formats.value.find(f => f.isVisible)?.id ?? null
    FormatManager.setDefaultFormatId(defaultFormatId.value ?? '')
  }

  loadFormats()
  const refreshed = formats.value.find(f => f.id === id) || null
  editingFormat.value = refreshed
  previewFormat.value = refreshed
}

const promptDelete = (formatId: string) => {
  formatToDelete.value = formatId
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (formatToDelete.value) {
    FormatManager.deleteFormat(formatToDelete.value)
    loadFormats()
    if (defaultFormatId.value === formatToDelete.value) {
      defaultFormatId.value = formats.value[0]?.id ?? null
      FormatManager.setDefaultFormatId(defaultFormatId.value ?? '')
    }
    if (previewFormat.value?.id === formatToDelete.value) {
      previewFormat.value = getPreviewFallback()
    }
  }
  formatToDelete.value = null
}

const cancelDelete = () => {
  formatToDelete.value = null
}

const startNewFormat = () => {
  const newFormat: BranchFormatTemplate = {
    id: `custom-${Date.now()}`,
    name: 'Nuevo Formato',
    templateString: '{campo1}-{campo2}',
    isReadonly: false,
    isVisible: true,
    language: 'es',
    fields: [
      { id: 'campo1', label: 'Campo 1', type: 'text', capitalization: 'LOWERCASE' },
      { id: 'campo2', label: 'Campo 2', type: 'text', capitalization: 'LOWERCASE' }
    ]
  }
  editingFormat.value = newFormat
  previewFormat.value = newFormat
}

const handleSave = (savedFormat: BranchFormatTemplate) => {
  const exists = formats.value.some(f => f.id === savedFormat.id)
  if (exists) {
    FormatManager.updateFormat(savedFormat)
  } else {
    FormatManager.addFormat(savedFormat)
  }
  editingFormat.value = null
  loadFormats()
  previewFormat.value = savedFormat
}

const handleCancel = () => {
  editingFormat.value = null
  previewFormat.value = getPreviewFallback()
}

const updatePreview = (format: BranchFormatTemplate) => {
  previewFormat.value = format
}

// Import/Export
const handleExport = () => {
  const dataStr = FormatManager.exportCustomFormats()
  if (dataStr === '[]') {
    alert('No hay formatos personalizados para exportar.')
    return
  }
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = 'branch-formats.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const jsonStr = e.target?.result as string
      FormatManager.importCustomFormats(jsonStr)
      loadFormats()
      alert('Formatos importados correctamente.')
    } catch (err) {
      alert('Error al importar formatos. Archivo inválido.')
    }
  }
  reader.readAsText(file)
  target.value = '' // reset input
}

</script>

<template>
  <div class="configuration-view container-wide">
    <FormatPreview :format="previewFormat" />

    <div v-if="editingFormat">
      <FormatEditor
        :format="editingFormat"
        @update:format="updatePreview"
        @save="handleSave"
        @cancel="handleCancel"
        @toggle-visibility="handleToggleVisibilityInEditor"
      />
    </div>

    <div v-else class="formats-list-section">
      <div class="list-header">
        <h3>Formatos Disponibles</h3>
        <button class="btn-primary" @click="startNewFormat">Crear Formato</button>
      </div>

      <div class="format-items">
        <div
          v-for="format in formats"
          :key="format.id"
          class="format-card"
          :class="{
            'format-card--selected': format.id === defaultFormatId,
            'format-card--hidden': !format.isVisible
          }"
          @click="selectFormat(format)"
        >
          <div class="format-info">
            <span class="format-name">
              {{ format.name }}
              <span v-if="format.isReadonly" class="badge">Predeterminado</span>
              <span v-if="format.id === defaultFormatId" class="badge badge--selected">Seleccionado</span>
              <span v-if="!format.isVisible" class="badge">Oculto</span>
            </span>
            <code class="format-template">{{ format.templateString }}</code>
          </div>
          <div class="format-actions" @click.stop>
            <button class="btn-secondary small-btn" @click="handleEdit(format)">Editar</button>
            <button v-if="format.isReadonly" class="btn-secondary small-btn" @click="handleClone(format.id)">Clonar</button>
            <button v-else class="btn-secondary small-btn delete-btn" @click="promptDelete(format.id)">Borrar</button>
          </div>
        </div>
      </div>

      <div class="import-export-section">
        <button class="btn-secondary" @click="handleExport">Exportar Personalizados</button>
        <label class="btn-secondary file-upload-btn">
          Importar JSON
          <input type="file" accept=".json" @change="handleImport" hidden />
        </label>
      </div>

      <div class="back-section">
        <button class="btn-secondary back-btn" @click="emit('close')">
          <ArrowLeftIcon class="icon" />
          <span>Volver</span>
        </button>
      </div>
    </div>

    <CustomModal
      v-model="showDeleteModal"
      title="Eliminar Formato"
      message="¿Estás seguro de que quieres eliminar este formato personalizado? Esta acción no se puede deshacer."
      confirmText="Borrar"
      cancelText="Cancelar"
      :danger="true"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.configuration-view {
  background-color: var(--bg-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: vars.$bp-mobile) {
    padding: 1.5rem;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: var(--text-main);
  }

  @media (max-width: vars.$bp-mobile) {
    flex-direction: column;
    align-items: flex-start;

    .btn-primary {
      width: 100%;
    }
  }
}

.format-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-surface);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--text-main);
  }

  &--selected {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px var(--accent-color);
  }

  &--hidden .format-info {
    opacity: 0.55;
  }

  @media (min-width: vars.$bp-mobile) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.format-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.format-name {
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  background-color: var(--border-color);
  color: var(--text-muted);

  &--selected {
    background-color: var(--accent-color);
    color: var(--bg-body);
  }
}

.format-template {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.format-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;

  @media (min-width: vars.$bp-mobile) {
    width: auto;
    justify-content: flex-end;
  }
}

.small-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.delete-btn {
  color: #ef4444;
  border-color: #fca5a5;
  &:hover {
    background-color: #fee2e2;
  }
}

.import-export-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.file-upload-btn {
  cursor: pointer;
  margin: 0;
}

.back-section {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
