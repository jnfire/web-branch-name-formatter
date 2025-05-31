import { describe, it, expect, vi } from 'vitest'
import { BranchManager } from '../../core/BranchManager'
import { Branch } from '../../core/Branch'
import type { BranchFormType } from '../../core/BranchTypes'
import { LocalStorageManager } from '../../utils/LocalStorageManager'

describe('BranchManager', () => {
  it('should initialize with an empty list of branches', () => {
    const manager = BranchManager.getInstance()
    expect(manager.getBranches()).toEqual([])
  })

  it('should add a new branch', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }

    manager.createBranch(formData)

    const branches = manager.getBranches()
    expect(branches).toHaveLength(1)
    expect(branches[0].projectId).toBe('PROJ')
    expect(branches[0].ticketId).toBe('TICKET-123')
    expect(branches[0].featureName).toBe('New Feature')
    expect(branches[0].branchName).toBe('TICKET-123--new-feature')
  })

  it('should remove a branch', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }

    manager.createBranch(formData)
    const branchToDelete = manager.getBranches()[0]

    manager.deleteBranch(branchToDelete.id)

    expect(manager.getBranches()).toHaveLength(0)
  })

  it('should not remove a branch if it does not exist', () => {
    const manager = BranchManager.getInstance()
    const formData: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }

    manager.createBranch(formData)
    const nonExistentBranch = new Branch({
      id: 999,
      ticketId: 'TICKET-999',
      featureName: 'Non-existent',
      projectId: 'PROJ'
    })

    manager.deleteBranch(nonExistentBranch.id)

    expect(manager.getBranches()).toHaveLength(1)
  })

  it('shoulf sort branches in ascending order', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }
    const formData2: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-456',
      featureName: 'Another Feature'
    }

    manager.createBranch(formData2)
    manager.createBranch(formData1)

    const branches = manager.getBranches(false)
    expect(branches[0].ticketId).toBe('TICKET-456')
    expect(branches[1].ticketId).toBe('TICKET-123')
  })

  it('should sort branches in descending order', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }
    const formData2: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-456',
      featureName: 'Another Feature'
    }

    manager.createBranch(formData2)
    manager.createBranch(formData1)

    const branches = manager.getBranches()
    expect(branches[0].ticketId).toBe('TICKET-123')
    expect(branches[1].ticketId).toBe('TICKET-456')
  })

  it('should not repeat branch ids', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    const formData1: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-123',
      featureName: 'New Feature'
    }
    const formData2: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-456',
      featureName: 'Another Feature'
    }
    const formData3: BranchFormType = {
      projectId: 'PROJ',
      ticketId: 'TICKET-789',
      featureName: 'Yet Another Feature'
    }

    manager.createBranch(formData1)
    manager.createBranch(formData2)
    manager.deleteBranch(1)
    manager.createBranch(formData3)

    const branches = manager.getBranches()
    expect(branches[0].id).not.toBe(branches[1].id)
  })

  it('should correct a branch name during load from local storage', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    // Simulate local storage with a combined projectId and ticketId in ticketId field
    const localStorageMock = {
      get: (key: string) => {
        if (key === 'branches') {
          return JSON.stringify([
            {
              id: 1,
              ticketId: 'PROJECT-123',
              featureName: 'Feature Name',
              projectId: ''
            }
          ])
        }
        return null
      },
      save: () => {}
    }

    vi.spyOn(LocalStorageManager, 'getInstance').mockReturnValue(localStorageMock as any)

    manager['loadBranches']()

    const branches = manager.getBranches()
    expect(branches).toHaveLength(1)
    expect(branches[0].projectId).toBe('PROJECT')
    expect(branches[0].ticketId).toBe('123')
    expect(branches[0].featureName).toBe('Feature Name')
  })
})
