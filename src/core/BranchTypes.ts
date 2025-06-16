export interface BranchFormType {
  projectId: string;
  ticketId: string;
  featureName: string;
}

export interface BranchType extends BranchFormType {
  id: number;
  branchName?: string;
}