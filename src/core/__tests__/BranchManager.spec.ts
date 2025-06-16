import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BranchManager } from '../../core/BranchManager'
import type { BranchFormType } from '../../core/BranchTypes'
import { LocalStorageManager } from '../../utils/LocalStorageManager'
import { Branch } from '@/core/Branch'

const mockBranches = [
  new Branch({ id: 1, projectId: 'PRJ', ticketId: '123', featureName: 'feature-a' }),
  new Branch({ id: 2, projectId: 'PRJ', ticketId: '124', featureName: 'feature-b' }),
  new Branch({ id: 3, projectId: 'PRJ2', ticketId: '125', featureName: 'feature-c' }),
  new Branch({ id: 4, projectId: 'PRJ2', ticketId: '126', featureName: 'feature-d' })
]

const branchManager = BranchManager.getInstance()
branchManager['branches'] = mockBranches

describe('BranchManager', () => {
  beforeEach(() => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()
  })

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
    expect(branches[0].branchName).toBe('PROJ-TICKET-123--new-feature')
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
    const nonExistentBranchId = 999

    const result = manager.deleteBranch(nonExistentBranchId)

    expect(result).toBe(false) // Verifica que no se eliminó ninguna rama
    expect(manager.getBranches()).toHaveLength(1) // Asegura que la rama original sigue existiendo
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

  it('should correctly handle a branch with a hyphen in the ticketId and a valid projectId', () => {
    const manager = BranchManager.getInstance()
    manager.clearBranches()

    // Simulate local storage with a branch having a hyphen in ticketId and a valid projectId
    const localStorageMock = {
      get: (key: string) => {
        if (key === 'branches') {
          return JSON.stringify([
            {
              id: 1,
              ticketId: 'TICKET-123-456',
              featureName: 'Feature Name',
              projectId: 'PROJ'
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
    expect(branches[0].projectId).toBe('PROJ') // Ensure projectId is not overwritten
    expect(branches[0].ticketId).toBe('TICKET-123-456') // Ensure ticketId remains intact
    expect(branches[0].featureName).toBe('Feature Name')
  })

  describe('filterBranches', () => {
    it('should filter branches by projectId', () => {
      const manager = BranchManager.getInstance()
      manager.clearBranches()
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-123', featureName: 'Feature A' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-124', featureName: 'Feature B' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-125', featureName: 'Feature C' })
      manager.createBranch({ projectId: 'PRJ2', ticketId: 'TICKET-126', featureName: 'Feature D' })

      const branches = manager.getBranches()
      expect(branches).toBeDefined()
      expect(branches).toHaveLength(4) // Verifica que el manager contiene las ramas iniciales

      const result = manager.filterBranches({ projectId: 'PRJ' })
      expect(result).toHaveLength(4)
      expect(result.map((branch) => branch.projectId)).toEqual(['PRJ2', 'PRJ', 'PRJ', 'PRJ'])
    })

    it('should filter branches by ticketId', () => {
      const manager = BranchManager.getInstance()
      manager.clearBranches()
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-123', featureName: 'Feature A' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-124', featureName: 'Feature B' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-125', featureName: 'Feature C' })
      manager.createBranch({ projectId: 'PRJ2', ticketId: 'TICKET-126', featureName: 'Feature D' })

      const branches = manager.getBranches()
      expect(branches).toBeDefined()
      expect(branches).toHaveLength(4) // Verifica que el manager contiene las ramas iniciales

      const result = manager.filterBranches({ ticketId: 'TICKET-125' })
      expect(result).toHaveLength(1)
      expect(result[0].ticketId).toBe('TICKET-125')
    })

    it('should filter branches by featureName', () => {
      const manager = BranchManager.getInstance()
      manager.clearBranches()
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-123', featureName: 'Feature A' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-124', featureName: 'Feature B' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-125', featureName: 'Feature C' })
      manager.createBranch({ projectId: 'PRJ2', ticketId: 'TICKET-126', featureName: 'Feature D' })

      const branches = manager.getBranches()
      expect(branches).toBeDefined()
      expect(branches).toHaveLength(4) // Verifica que el manager contiene las ramas iniciales

      const result = manager.filterBranches({ featureName: 'Feature D' })
      expect(result).toHaveLength(1)
      expect(result[0].featureName).toBe('Feature D')
    })

    it('should filter branches by multiple fields', () => {
      const manager = BranchManager.getInstance()
      manager.clearBranches()
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-123', featureName: 'Feature A' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-124', featureName: 'Feature B' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-125', featureName: 'Feature C' })
      manager.createBranch({ projectId: 'PRJ2', ticketId: 'TICKET-126', featureName: 'Feature D' })

      const branches = manager.getBranches()
      expect(branches).toBeDefined()
      expect(branches).toHaveLength(4) // Verifica que el manager contiene las ramas iniciales

      const result = manager.filterBranches({ projectId: 'PRJ2', ticketId: 'TICKET-126' })
      expect(result).toHaveLength(1)
      expect(result[0].projectId).toBe('PRJ2')
      expect(result[0].ticketId).toBe('TICKET-126')
    })

    it('should return all branches if no filter is provided', () => {
      const manager = BranchManager.getInstance()
      manager.clearBranches()
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-123', featureName: 'Feature A' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-124', featureName: 'Feature B' })
      manager.createBranch({ projectId: 'PRJ', ticketId: 'TICKET-125', featureName: 'Feature C' })
      manager.createBranch({ projectId: 'PRJ2', ticketId: 'TICKET-126', featureName: 'Feature D' })

      const branches = manager.getBranches()
      expect(branches).toBeDefined()
      expect(branches).toHaveLength(4) // Verifica que el manager contiene las ramas iniciales

      const result = manager.filterBranches({})
      expect(result).toHaveLength(4)
    })
  })
})
