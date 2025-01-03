import { describe, it, expect } from 'vitest'
import { BranchManager } from '../../core/BranchManager'
import { Branch } from '../../core/Branch'
import type { BranchFormType } from '../../core/BranchTypes'

describe('BranchManager', () => {
  it('should initialize with an empty list of branches', () => {
    const manager = BranchManager.getInstance()
    expect(manager.getBranches()).toEqual([])
  })

  it('should add a new branch', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }

    manager.createBranch(formData)

    const branches = manager.getBranches()
    expect(branches).toHaveLength(1)
    expect(branches[0].ticketId).toBe('TICKET-123')
    expect(branches[0].featureName).toBe('New Feature')
    expect(branches[0].branchName).toBe('TICKET-123--new-feature')
  })

  it('should remove a branch', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }

    manager.createBranch(formData)
    const branchToDelete = manager.getBranches()[0]

    manager.deleteBranch(branchToDelete.id)

    expect(manager.getBranches()).toHaveLength(1)
  })

  it('should not remove a branch if it does not exist', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }

    manager.createBranch(formData)
    const nonExistentBranch = new Branch({
      id: 999,
      ticketId: 'TICKET-999',
      featureName: 'Non-existent'
    })

    manager.deleteBranch(nonExistentBranch.id)

    expect(manager.getBranches()).toHaveLength(2)
  })

  it('shoulf sort branches in ascending order', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }
    const formData2: BranchFormType = { ticketId: 'TICKET-456', featureName: 'Another Feature' }

    manager.createBranch(formData2)
    manager.createBranch(formData1)

    const branches = manager.getBranches(false)
    expect(branches[0].ticketId).toBe('TICKET-456')
    expect(branches[1].ticketId).toBe('TICKET-123')
  })

  it('should sort branches in descending order', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }
    const formData2: BranchFormType = { ticketId: 'TICKET-456', featureName: 'Another Feature' }

    manager.createBranch(formData2)
    manager.createBranch(formData1)

    const branches = manager.getBranches()
    expect(branches[0].ticketId).toBe('TICKET-123')
    expect(branches[1].ticketId).toBe('TICKET-456')
  })

  it('should not repeat branch ids', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' }
    const formData2: BranchFormType = { ticketId: 'TICKET-456', featureName: 'Another Feature' }
    const formData3: BranchFormType = { ticketId: 'TICKET-789', featureName: 'Yet Another Feature' }

    manager.createBranch(formData1)
    manager.createBranch(formData2)
    manager.deleteBranch(1)
    manager.createBranch(formData3)

    const branches = manager.getBranches()
    expect(branches[0].id).not.toBe(branches[1].id)
  })
})
