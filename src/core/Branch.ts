import type { BranchType } from '@/core/BranchTypes'

export class Branch implements BranchType {
  id: number;
  ticketId: string;
  developName: string;
  branchName: string;

  constructor(branch: BranchType) {
    this.id = branch.id;
    this.ticketId = branch.ticketId;
    this.developName = branch.developName;
    this.branchName = this.getBranchName(branch);
  }

  private getBranchName(branch: BranchType) {
    return branch.ticketId + '-' + branch.developName
  }
}