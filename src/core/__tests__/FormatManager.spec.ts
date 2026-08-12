import { describe, expect, it, beforeEach } from 'vitest'
import { FormatManager } from '../FormatManager'
import type { BranchFormatTemplate } from '../FormatTypes'

describe('FormatManager', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns default formats initially', () => {
    const formats = FormatManager.getFormats()
    expect(formats.length).toBeGreaterThan(0)
    expect(formats.some(f => f.id === 'gitflow')).toBe(true)
    expect(formats.some(f => f.id === 'conventional-commits')).toBe(true)
  })

  it('can clone a predefined format into a custom one', () => {
    const cloned = FormatManager.cloneFormat('gitflow', (val) => val + ' (translated)', '(copy)')
    expect(cloned).not.toBeNull()
    expect(cloned!.id.startsWith('custom-')).toBe(true)
    expect(cloned!.isReadonly).toBe(false)
    expect(cloned!.name).toContain('(copy)')
    
    // Ensure it's in the list of formats now
    const customFormats = FormatManager.getCustomFormats()
    expect(customFormats.length).toBe(1)
    expect(customFormats[0].id).toBe(cloned!.id)
  })

  it('preserves field type and options when cloning', () => {
    const cloned = FormatManager.cloneFormat('gitflow', (val) => val, '(copy)')
    const typeField = cloned!.fields.find(f => f.id === 'type')
    expect(typeField).toBeDefined()
    expect(typeField!.type).toBe('select')
    expect(typeField!.options).toBeDefined()
    expect(typeField!.options!.length).toBeGreaterThan(0)
    expect(typeField!.options).toContain('feature')
  })

  it('can add a new custom format and update it', () => {
    const newFormat: BranchFormatTemplate = {
      id: 'test-custom',
      name: 'My Custom Format',
      templateString: '{customField}',
      isReadonly: false,
      isVisible: true,
      language: 'es',
      fields: [
        { id: 'customField', label: 'Custom Field', type: 'select', options: ['A', 'B'], capitalization: 'AS_IS' }
      ]
    }
    
    FormatManager.addFormat(newFormat)
    
    let customFormats = FormatManager.getCustomFormats()
    expect(customFormats.length).toBe(1)
    expect(customFormats[0].fields[0].options).toEqual(['A', 'B'])

    // Update the format
    newFormat.fields[0].options = ['C', 'D']
    FormatManager.updateFormat(newFormat)

    customFormats = FormatManager.getCustomFormats()
    expect(customFormats[0].fields[0].options).toEqual(['C', 'D'])
  })

  it('can delete a custom format', () => {
    const newFormat: BranchFormatTemplate = {
      id: 'test-custom-2',
      name: 'Format to delete',
      templateString: '',
      isReadonly: false,
      isVisible: true,
      language: 'es',
      fields: []
    }
    
    FormatManager.addFormat(newFormat)
    expect(FormatManager.getCustomFormats().length).toBe(1)

    FormatManager.deleteFormat('test-custom-2')
    expect(FormatManager.getCustomFormats().length).toBe(0)
  })
})
