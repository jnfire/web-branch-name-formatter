import { Branch } from '@/core/Branch'
import type { BranchFormType } from '@/core/BranchTypes'


export class BranchManager {
  private branches: Branch[] = [];

  public getBranches(): Branch[] {
    return this.branches;
  }

  public addBranch(formData: BranchFormType): void {
    const newBranch = new Branch({
      id: this.branches.length + 1,
      ticketId: formData.ticketId,
      featureName: formData.featureName,
    });
    this.branches.push(newBranch);
  }

  public removeBranch(BranchToDelete: Branch): void {
    this.branches = this.branches.filter(branch => branch.id !== BranchToDelete.id);
  }
}