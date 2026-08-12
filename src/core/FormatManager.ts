import type { BranchFormatTemplate } from '@/core/FormatTypes'

export class FormatManager {
  private static readonly STORAGE_KEY_CUSTOM = 'branch-formats-custom'
  private static readonly STORAGE_KEY_HIDDEN_PREDEFINED = 'branch-formats-hidden'

  private static readonly DEFAULT_FORMATS: BranchFormatTemplate[] = [
    {
      id: 'default-app',
      name: 'Formato por defecto (App)',
      templateString: '{projectId}-{ticketId}--{featureName}',
      isReadonly: true,
      isVisible: true,
      fields: [
        { id: 'projectId', label: 'ID Proyecto', operations: ['UPPERCASE', 'BASIC_CLEAN'] },
        { id: 'ticketId', label: 'ID Ticket', operations: ['UPPERCASE', 'BASIC_CLEAN'] },
        { id: 'featureName', label: 'Nombre Funcionalidad', operations: ['LOWERCASE', 'REPLACE_SLASHES', 'BASIC_CLEAN'] }
      ]
    },
    {
      id: 'gitflow',
      name: 'GitFlow (feature/ticket-desc)',
      templateString: 'feature/{ticketId}-{description}',
      isReadonly: true,
      isVisible: true,
      fields: [
        { id: 'ticketId', label: 'ID Ticket', operations: ['UPPERCASE', 'BASIC_CLEAN'] },
        { id: 'description', label: 'Descripción', operations: ['LOWERCASE', 'BASIC_CLEAN'] }
      ]
    },
    {
      id: 'conventional-commits',
      name: 'Conventional Commits',
      templateString: '{type}/{scope}/{description}',
      isReadonly: true,
      isVisible: true,
      fields: [
        { id: 'type', label: 'Tipo (feat, fix...)', operations: ['LOWERCASE', 'BASIC_CLEAN'] },
        { id: 'scope', label: 'Ámbito', operations: ['LOWERCASE', 'BASIC_CLEAN'] },
        { id: 'description', label: 'Descripción', operations: ['LOWERCASE', 'BASIC_CLEAN'] }
      ]
    }
  ]

  static getFormats(): BranchFormatTemplate[] {
    const customFormats = this.getCustomFormats()
    const hiddenPredefined = this.getHiddenPredefinedIds()

    const predefined = this.DEFAULT_FORMATS.map(format => ({
      ...format,
      isVisible: !hiddenPredefined.includes(format.id)
    }))

    return [...predefined, ...customFormats]
  }

  static getVisibleFormats(): BranchFormatTemplate[] {
    return this.getFormats().filter(f => f.isVisible)
  }

  static getCustomFormats(): BranchFormatTemplate[] {
    const data = localStorage.getItem(this.STORAGE_KEY_CUSTOM)
    if (!data) return []
    try {
      return JSON.parse(data) as BranchFormatTemplate[]
    } catch {
      return []
    }
  }

  private static saveCustomFormats(formats: BranchFormatTemplate[]): void {
    localStorage.setItem(this.STORAGE_KEY_CUSTOM, JSON.stringify(formats))
  }

  private static getHiddenPredefinedIds(): string[] {
    const data = localStorage.getItem(this.STORAGE_KEY_HIDDEN_PREDEFINED)
    if (!data) return []
    try {
      return JSON.parse(data) as string[]
    } catch {
      return []
    }
  }

  private static saveHiddenPredefinedIds(ids: string[]): void {
    localStorage.setItem(this.STORAGE_KEY_HIDDEN_PREDEFINED, JSON.stringify(ids))
  }

  static addFormat(format: BranchFormatTemplate): void {
    const custom = this.getCustomFormats()
    // ensure it's not readonly
    const newFormat = { ...format, isReadonly: false }
    custom.push(newFormat)
    this.saveCustomFormats(custom)
  }

  static updateFormat(updatedFormat: BranchFormatTemplate): void {
    const custom = this.getCustomFormats()
    const index = custom.findIndex(f => f.id === updatedFormat.id)
    if (index !== -1) {
      custom[index] = { ...updatedFormat, isReadonly: false }
      this.saveCustomFormats(custom)
    }
  }

  static deleteFormat(id: string): void {
    const custom = this.getCustomFormats()
    const filtered = custom.filter(f => f.id !== id)
    this.saveCustomFormats(filtered)
  }

  static toggleVisibility(id: string): void {
    const custom = this.getCustomFormats()
    const customIndex = custom.findIndex(f => f.id === id)
    
    if (customIndex !== -1) {
      custom[customIndex].isVisible = !custom[customIndex].isVisible
      this.saveCustomFormats(custom)
    } else {
      // It might be a predefined format
      const isPredefined = this.DEFAULT_FORMATS.some(f => f.id === id)
      if (isPredefined) {
        const hiddenIds = this.getHiddenPredefinedIds()
        if (hiddenIds.includes(id)) {
          this.saveHiddenPredefinedIds(hiddenIds.filter(hiddenId => hiddenId !== id))
        } else {
          hiddenIds.push(id)
          this.saveHiddenPredefinedIds(hiddenIds)
        }
      }
    }
  }

  static cloneFormat(id: string): BranchFormatTemplate | null {
    const allFormats = this.getFormats()
    const formatToClone = allFormats.find(f => f.id === id)
    if (!formatToClone) return null

    const newId = `custom-${Date.now()}`
    const clonedFormat: BranchFormatTemplate = {
      ...JSON.parse(JSON.stringify(formatToClone)), // Deep clone for fields
      id: newId,
      name: `${formatToClone.name} (Clon)`,
      isReadonly: false,
      isVisible: true
    }
    this.addFormat(clonedFormat)
    return clonedFormat
  }

  static exportCustomFormats(): string {
    return JSON.stringify(this.getCustomFormats(), null, 2)
  }

  static importCustomFormats(jsonString: string): void {
    try {
      const parsed = JSON.parse(jsonString) as BranchFormatTemplate[]
      if (!Array.isArray(parsed)) throw new Error('Invalid format')
      
      const currentCustom = this.getCustomFormats()
      // Create new IDs for imported to avoid collisions, or just append them if they look valid
      const newFormats = parsed.map(f => ({
        ...f,
        id: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        isReadonly: false
      }))
      
      this.saveCustomFormats([...currentCustom, ...newFormats])
    } catch (e) {
      console.error('Error importing formats:', e)
      throw e
    }
  }
}
