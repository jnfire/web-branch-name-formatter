import type { BranchFormatTemplate, FormatOperation } from '@/core/FormatTypes'
import type { BranchFormType } from '@/core/BranchTypes'

export class BranchFormatter {
  static format(template: BranchFormatTemplate, values: BranchFormType): string {
    let result = template.templateString

    for (const field of template.fields) {
      const rawValue = values[field.id] || ''
      const formattedValue = this.applyOperations(rawValue, field.operations)

      const placeholder = `{${field.id}}`
      result = result.split(placeholder).join(formattedValue)
    }

    return this.removeLeadingAndTrailingDashes(result)
  }

  static applyOperations(text: string, operations: FormatOperation[]): string {
    let result = text
    for (const op of operations) {
      switch (op) {
        case 'UPPERCASE':
          result = result.toUpperCase()
          break
        case 'LOWERCASE':
          result = result.toLowerCase()
          break
        case 'REPLACE_SLASHES':
          result = result.replace(/\//g, '-o-')
          break
        case 'REPLACE_DOTS':
          result = result.replace(/\./g, '-')
          break
        case 'REPLACE_SPACES':
          result = result.replace(/\s/g, '-')
          break
        case 'REMOVE_MULTIPLE_DASHES':
          result = result.replace(/-+/g, '-')
          break
        case 'SET_NY':
          result = result.replace(/ñ/g, 'ny').replace(/Ñ/g, 'NY')
          break
        case 'REMOVE_ACCENTS':
          result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          break
        case 'REMOVE_SPECIAL_CHARS':
          result = result.replace(/[^a-zA-Z0-9-]/g, '')
          break
        case 'BASIC_CLEAN':
          result = this.applyOperations(result, [
            'REPLACE_DOTS',
            'REPLACE_SPACES',
            'REMOVE_MULTIPLE_DASHES',
            'SET_NY',
            'REMOVE_ACCENTS',
            'REMOVE_SPECIAL_CHARS'
          ])
          break
      }
    }
    return result
  }

  private static removeLeadingAndTrailingDashes(text: string): string {
    return text.replace(/^-+|-+$/g, '')
  }
}
