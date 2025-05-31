import { Branch } from '@/core/Branch'
import type { BranchFormType } from '@/core/BranchTypes'
import { LocalStorageManager } from '@/utils/LocalStorageManager'

export class BranchManager {
  private static instance: BranchManager
  private branches: Branch[] = []
  private lastId: number = 0

  private constructor() {}

  public static getInstance(): BranchManager {
    if (!BranchManager.instance) {
      BranchManager.instance = new BranchManager()
    }
    return BranchManager.instance
  }

  public getBranches(isDescending: boolean = true): Branch[] {
    if (!this.branches.length) {
      this.loadBranches()
    }
    return this.branches.sort((a, b) => {
      return isDescending ? this.descending(b, a) : this.ascending(a, b)
    })
  }

  private ascending(a: Branch, b: Branch) {
    return a.id - b.id
  }

  private descending(b: Branch, a: Branch) {
    return b.id - a.id
  }

  private loadBranches(): void {
    const localStorage = LocalStorageManager.getInstance()
    const branches = localStorage.get('branches')
    if (branches) {
      this.branches = JSON.parse(branches).map((branch: Branch) => this.loadBranch(branch))
    }
    this.setLastId()
  }

  private loadBranch(branch: Branch): Branch {
    let projectId = branch.projectId || ''
    let ticketId = branch.ticketId || ''

    if (ticketId.includes('-') && !projectId) {
      const splitIds = this.splitProjectAndTicketId(ticketId)
      projectId = splitIds.projectId
      ticketId = splitIds.ticketId
    }

    const id = branch.id || 0
    const featureName = branch.featureName || ''

    return new Branch({
      id: id,
      projectId: projectId.trim(),
      ticketId: ticketId.trim(),
      featureName: featureName.trim()
    })
  }

  private splitProjectAndTicketId(combinedId: string): { projectId: string; ticketId: string } {
    const [projectId, ticketId] = combinedId.split('-')
    return {
      projectId: projectId || '',
      ticketId: ticketId || ''
    }
  }

  private setLastId(): void {
    this.lastId = this.branches.reduce((maxId, branch) => {
      return branch.id > maxId ? branch.id : maxId
    }, 0)
  }

  public createBranch(formData: BranchFormType): void {
    this.setNewId()
    const newBranch = new Branch({
      id: this.lastId,
      ticketId: formData.ticketId,
      featureName: formData.featureName,
      projectId: formData.projectId
    })
    this.branches.push(newBranch)
    this.saveBranches()
  }

  private setNewId() {
    this.lastId = this.lastId + 1
  }

  public deleteBranch(branchId: number): boolean {
    const index = this.branches.findIndex((branch) => branch.id === branchId)
    if (index !== -1) {
      this.branches.splice(index, 1)
      this.saveBranches()
      return true // Indica que la rama fue eliminada
    }
    return false // Indica que la rama no existía
  }

  private saveBranches(): void {
    const localStorage = LocalStorageManager.getInstance()
    localStorage.save('branches', JSON.stringify(this.branches))
  }

  public clearBranches(): void {
    this.lastId = 0
    this.branches = []
    this.saveBranches()
  }
}
