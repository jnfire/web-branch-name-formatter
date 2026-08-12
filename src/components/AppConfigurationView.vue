<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FormatManager } from '@/core/FormatManager'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import FormatPreview from '@/components/FormatPreview.vue'
import FormatEditor from '@/components/FormatEditor.vue'

const formats = ref<BranchFormatTemplate[]>([])
const editingFormat = ref<BranchFormatTemplate | null>(null)
const previewFormat = ref<BranchFormatTemplate | null>(null)

const loadFormats = () => {
  formats.value = FormatManager.getFormats()
}

onMounted(() => {
  loadFormats()
  if (formats.value.length > 0) {
    previewFormat.value = formats.value[0]
  }
})

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

const handleToggleVisibility = (formatId: string) => {
  FormatManager.toggleVisibility(formatId)
  loadFormats()
}

const handleDelete = (formatId: string) => {
  if (confirm('¿Seguro que quieres eliminar este formato?')) {
    FormatManager.deleteFormat(formatId)
    loadFormats()
    if (previewFormat.value?.id === formatId) {
      previewFormat.value = formats.value[0] || null
    }
  }
}

const startNewFormat = () => {
  const newFormat: BranchFormatTemplate = {
    id: `custom-${Date.now()}`,
    name: 'Nuevo Formato',
    templateString: '{campo1}-{campo2}',
    isReadonly: false,
    isVisible: true,
    fields: [
      { id: 'campo1', label: 'Campo 1', operations: ['LOWERCASE'] },
      { id: 'campo2', label: 'Campo 2', operations: ['LOWERCASE'] }
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
  previewFormat.value = formats.value[0] || null
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
  <div class="configuration-view">
    <FormatPreview :format="previewFormat" />

    <div v-if="editingFormat">
      <FormatEditor 
        :format="editingFormat" 
        @update:format="updatePreview"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="formats-list-section">
      <div class="list-header">
        <h3>Formatos Disponibles</h3>
        <button class="btn-primary" @click="startNewFormat">Crear Formato</button>
      </div>

      <div class="format-items">
        <div v-for="format in formats" :key="format.id" class="format-card" @click="previewFormat = format">
          <div class="format-info">
            <span class="format-name">{{ format.name }} <span v-if="format.isReadonly" class="badge">Predeterminado</span></span>
            <code class="format-template">{{ format.templateString }}</code>
          </div>
          <div class="format-actions" @click.stop>
            <label class="toggle-visibility">
              <input type="checkbox" :checked="format.isVisible" @change="handleToggleVisibility(format.id)" />
              Visible en App
            </label>
            <button v-if="format.isReadonly" class="btn-secondary small-btn" @click="handleClone(format.id)">Clonar</button>
            <template v-else>
              <button class="btn-secondary small-btn" @click="handleEdit(format)">Editar</button>
              <button class="btn-secondary small-btn delete-btn" @click="handleDelete(format.id)">Borrar</button>
            </template>
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
    </div>
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
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    color: var(--text-main);
  }
}

.format-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-surface);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--text-main);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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
}

.format-template {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.format-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
}

.toggle-visibility {
  font-size: 0.85rem;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
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
</style>
