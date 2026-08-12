import type { BranchFormatTemplate } from '@/core/FormatTypes'

export class FormatManager {
  private static readonly STORAGE_KEY_CUSTOM = 'branch-formats-custom'
  private static readonly STORAGE_KEY_HIDDEN_PREDEFINED = 'branch-formats-hidden'
  private static readonly STORAGE_KEY_DEFAULT_FORMAT = 'branch-format-default-id'

  private static readonly DEFAULT_FORMATS: BranchFormatTemplate[] = [
    {
      id: 'default-app',
      name: 'Formato por defecto (App)',
      templateString: '{projectId}-{ticketId}--{featureName}',
      isReadonly: true,
      isVisible: true,
      language: 'es',
      fields: [
        { id: 'projectId', label: 'ID Proyecto', type: 'text', capitalization: 'UPPERCASE' },
        { id: 'ticketId', label: 'ID Ticket', type: 'text', capitalization: 'UPPERCASE' },
        { id: 'featureName', label: 'Nombre Funcionalidad', type: 'text', capitalization: 'LOWERCASE' }
      ]
    },
    {
      id: 'gitflow',
      name: 'GitFlow (type/ticket-desc)',
      templateString: '{type}/{ticketId}-{description}',
      isReadonly: true,
      isVisible: true,
      language: 'es',
      fields: [
        { id: 'type', label: 'Tipo', type: 'select', options: ['feature', 'bugfix', 'hotfix', 'release', 'chore'], capitalization: 'LOWERCASE' },
        { id: 'ticketId', label: 'ID Ticket', type: 'text', capitalization: 'UPPERCASE' },
        { id: 'description', label: 'Descripción', type: 'text', capitalization: 'LOWERCASE' }
      ]
    },
    {
      id: 'conventional-commits',
      name: 'Conventional Commits',
      templateString: '{type}/{scope}/{description}',
      isReadonly: true,
      isVisible: true,
      language: 'es',
      fields: [
        { id: 'type', label: 'Tipo (feat, fix...)', type: 'select', options: ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'], capitalization: 'LOWERCASE' },
        { id: 'scope', label: 'Ámbito', type: 'text', capitalization: 'LOWERCASE' },
        { id: 'description', label: 'Descripción', type: 'text', capitalization: 'LOWERCASE' }
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

  static getDefaultFormatId(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_DEFAULT_FORMAT)
  }

  static setDefaultFormatId(id: string): void {
    localStorage.setItem(this.STORAGE_KEY_DEFAULT_FORMAT, id)
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
    const current = this.getFormats().find(f => f.id === id)
    if (!current) return
    this.setVisibility(id, !current.isVisible)
  }

  static setVisibility(id: string, visible: boolean): void {
    const custom = this.getCustomFormats()
    const customIndex = custom.findIndex(f => f.id === id)

    if (customIndex !== -1) {
      custom[customIndex].isVisible = visible
      this.saveCustomFormats(custom)
    } else {
      // It might be a predefined format
      const isPredefined = this.DEFAULT_FORMATS.some(f => f.id === id)
      if (isPredefined) {
        const hiddenIds = this.getHiddenPredefinedIds()
        const isCurrentlyHidden = hiddenIds.includes(id)
        if (visible && isCurrentlyHidden) {
          this.saveHiddenPredefinedIds(hiddenIds.filter(hiddenId => hiddenId !== id))
        } else if (!visible && !isCurrentlyHidden) {
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
