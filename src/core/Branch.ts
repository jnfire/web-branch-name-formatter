import type { BranchType } from '@/core/BranchTypes'
import { BranchFormatter } from '@/core/BranchFormatter'

export class Branch implements BranchType {
  id: number
  projectId: string
  ticketId: string
  featureName: string
  branchName: string

  constructor(branch: BranchType) {
    this.id = branch.id
    this.projectId = branch.projectId
    this.ticketId = branch.ticketId
    this.featureName = branch.featureName
    this.branchName = BranchFormatter.format(branch)
  }
}
