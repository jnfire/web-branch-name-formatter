export interface BranchFormType {
  ticketId: string;
  featureName: string;
}

export interface BranchType extends BranchFormType {
  id: number;
  branchName?: string;
}