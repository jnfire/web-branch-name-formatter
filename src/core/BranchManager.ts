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
      this.branches = JSON.parse(branches).map((branch: Branch) => new Branch(branch))
      this.correctExistingBranches() // Método temporal para corregir registros existentes
    }
    this.setLastId()
  }

  /**
   * Método temporal para corregir registros existentes en el local storage.
   * Este método debe eliminarse después de un tiempo cuando todos los datos estén corregidos.
   */
  private correctExistingBranches(): void {
    this.branches = this.branches.map((branch) => {
      if (!branch.projectId) {
        const [projectId, ticketId] = branch.ticketId.split('-')
        branch.projectId = projectId || ''
        branch.ticketId = ticketId || branch.ticketId
      }
      return branch
    })
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
      projectId: formData.projectId,
    })
    this.branches.push(newBranch)
    this.saveBranches()
  }

  private setNewId() {
    this.lastId = this.lastId + 1
  }

  public deleteBranch(branchId: number): void {
    const index = this.branches.findIndex((branch) => branch.id === branchId)
    if (index !== -1) {
      this.branches.splice(index, 1)
    }
    this.saveBranches()
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
