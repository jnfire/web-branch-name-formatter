import { Branch } from '@/core/Branch'
import type { BranchFormType } from '@/core/BranchTypes'


export class BranchManager {
  private branches: Branch[] = [];

  public getBranches(): Branch[] {
    return this.branches;
  }

  public createBranch(formData: BranchFormType): void {
    const newBranch = new Branch({
      id: this.branches.length + 1,
      ticketId: formData.ticketId,
      featureName: formData.featureName,
    });
    this.branches.push(newBranch);
  }

  public deleteBranch(branchId: number): void {
    const index = this.branches.findIndex(branch => branch.id === branchId);
    if (index !== -1) {
      this.branches.splice(index, 1);
    }
  }
}