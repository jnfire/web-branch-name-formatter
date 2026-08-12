import { describe, expect, it } from 'vitest'
import { BranchFormatter } from '../BranchFormatter'
import type { BranchFormatTemplate } from '../FormatTypes'

describe('BranchFormatter', () => {
  const dummyTemplate: BranchFormatTemplate = {
    id: 'test',
    name: 'Test',
    templateString: '{projectId}-{ticketId}--{featureName}',
    isReadonly: true,
    isVisible: true,
    fields: [
      { id: 'projectId', label: 'ID', operations: ['UPPERCASE', 'BASIC_CLEAN'] },
      { id: 'ticketId', label: 'TICKET', operations: ['UPPERCASE', 'BASIC_CLEAN'] },
      { id: 'featureName', label: 'FEATURE', operations: ['LOWERCASE', 'REPLACE_SLASHES', 'BASIC_CLEAN'] }
    ]
  }

  it('should apply operations correctly', () => {
    const values = {
      projectId: 'proj',
      ticketId: 't-123',
      featureName: 'My/Feature Name'
    }
    const result = BranchFormatter.format(dummyTemplate, values)
    expect(result).toBe('PROJ-T-123--my-o-feature-name')
  })

  it('should remove multiple dashes', () => {
    const values = {
      projectId: 'PROJ',
      ticketId: '123',
      featureName: 'my----feature'
    }
    const result = BranchFormatter.format(dummyTemplate, values)
    expect(result).toBe('PROJ-123--my-feature')
  })

  it('should replace ñ and accents', () => {
    const values = {
      projectId: 'prój',
      ticketId: 'tíckët',
      featureName: 'niño'
    }
    const result = BranchFormatter.format(dummyTemplate, values)
    expect(result).toBe('PROJ-TICKET--ninyo')
  })
})
