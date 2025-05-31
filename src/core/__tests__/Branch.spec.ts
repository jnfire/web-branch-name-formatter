import { describe, it, expect } from 'vitest'
import { Branch } from '../../core/Branch'
import type { BranchType } from '../../core/BranchTypes'

describe('Branch', () => {
  it('should create a Branch instance with formatted branchName', () => {
    const branchData: BranchType = {
      id: 1,
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }

    const branch = new Branch(branchData)

    expect(branch.id).toBe(1)
    expect(branch.projectId).toBe('PROJ')
    expect(branch.ticketId).toBe('TICKET-123')
    expect(branch.featureName).toBe('New Feature')
    expect(branch.branchName).toBe('PROJ-TICKET-123--new-feature')
  })

  it('should format the branchName correctly', () => {
    const branchData: BranchType = {
      id: 2,
      projectId: 'PROJ',
      ticketId: 'TICKET-456',
      featureName: 'Another Feature'
    }

    const branch = new Branch(branchData)

    expect(branch.branchName).toBe('PROJ-TICKET-456--another-feature')
  })

  it('should handle special characters in featureName', () => {
    const branchData: BranchType = {
      id: 3,
      projectId: 'PROJ',
      ticketId: 'TICKET-789',
      featureName: 'Feature with Special Characters!@#'
    }

    const branch = new Branch(branchData)

    expect(branch.branchName).toBe('PROJ-TICKET-789--feature-with-special-characters')
  })

  it('should handle spaces in featureName', () => {
    const branchData: BranchType = {
      id: 4,
      projectId: 'PROJ',
      ticketId: 'TICKET-101',
      featureName: 'Feature with spaces'
    }

    const branch = new Branch(branchData)

    expect(branch.branchName).toBe('PROJ-TICKET-101--feature-with-spaces')
  })

  it('should handle multiple dashes in featureName', () => {
    const branchData: BranchType = {
      id: 5,
      projectId: 'PROJ',
      ticketId: 'TICKET-202',
      featureName: 'Feature---with---multiple---dashes'
    }

    const branch = new Branch(branchData)

    expect(branch.branchName).toBe('PROJ-TICKET-202--feature-with-multiple-dashes')
  })
})
