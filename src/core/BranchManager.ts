import { Branch } from '@/core/Branch'
import type { BranchFormType } from '@/core/BranchTypes'
import { LocalStorageManager } from './LocalStorageManager'


export class BranchManager {
  private static instance: BranchManager;
  private branches: Branch[] = [];

  private constructor() {}

  public static getInstance(): BranchManager {
    if (!BranchManager.instance) {
      BranchManager.instance = new BranchManager();
    }
    return BranchManager.instance;
  }

  public getBranches(): Branch[] {
    if (!this.branches.length) {
      this.loadBranches();
    }
    return this.branches;
  }

  private loadBranches(): void {
    const localStorage = LocalStorageManager.getInstance();
    const branches = localStorage.get('branches');
    if (branches) {
      this.branches = JSON.parse(branches).map((branch: Branch) => new Branch(branch));
    }
  }

  public createBranch(formData: BranchFormType): void {
    const newBranch = new Branch({
      id: this.branches.length + 1,
      ticketId: formData.ticketId,
      featureName: formData.featureName,
    });
    this.branches.push(newBranch);
    this.saveBranches();
  }

  public deleteBranch(branchId: number): void {
    const index = this.branches.findIndex(branch => branch.id === branchId);
    if (index !== -1) {
      this.branches.splice(index, 1);
    }
    this.saveBranches();
  }

  private saveBranches(): void {
    const localStorage = LocalStorageManager.getInstance();
    localStorage.save('branches', JSON.stringify(this.branches));
  }
}