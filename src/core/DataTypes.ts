export interface BranchFormType {
  ticketId: string;
  developName: string;
}

export interface BranchType extends BranchFormType {
  id: number;
  branchName?: string;
}