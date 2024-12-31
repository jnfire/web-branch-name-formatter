import type { BranchType } from '@/core/BranchTypes'
import { BranchFormatter } from '@/core/BranchFormatter'

export class Branch implements BranchType {
  id: number
  ticketId: string
  featureName: string
  branchName: string

  constructor(branch: BranchType) {
    this.id = branch.id
    this.ticketId = branch.ticketId
    this.featureName = branch.featureName
    this.branchName = BranchFormatter.format(branch)
  }
}
