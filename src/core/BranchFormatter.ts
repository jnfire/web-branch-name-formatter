import type { BranchType } from '@/core/BranchTypes'

export class BranchFormatter {
  static format(branch: BranchType): string {
    const projectId: string = branch.projectId ? this.cleanProjectId(branch.projectId) : ''
    const ticketId: string = branch.ticketId ? this.cleanTicketId(branch.ticketId) : ''
    const featureName: string = branch.featureName ? this.cleanFeatureName(branch.featureName) : ''
    return this.removeLeadingAndTrailingDashes(`${projectId}-${ticketId}--${featureName}`)
  }

  private static removeLeadingAndTrailingDashes(text: string): string {
    return text.replace(/^-+|-+$/g, '')
  }

  private static cleanProjectId(projectId: string): string {
    return this.basicClean(this.toUpperCase(projectId))
  }

  private static cleanTicketId(ticketId: string): string {
    return this.basicClean(this.toUpperCase(ticketId))
  }

  private static toUpperCase(text: string): string {
    return text.toUpperCase()
  }

  private static cleanFeatureName(featureName: string): string {
    return this.basicClean(this.replaceSlash(this.toLowerCase(featureName)))
  }

  private static toLowerCase(text: string): string {
    return text.toLowerCase()
  }

  private static replaceSlash(text: string): string {
    return text.replace(/\//g, '-o-')
  }

  private static basicClean(text: string): string {
    text = this.replaceSpaces(text)
    text = this.removeMultipleDashes(text)
    text = this.removeSpecialCharacters(text)
    return text
  }

  private static replaceSpaces(text: string): string {
    return text.replace(/\s/g, '-')
  }

  private static removeMultipleDashes(text: string): string {
    return text.replace(/-+/g, '-')
  }

  private static removeSpecialCharacters(text: string): string {
    text = this.setNy(text)
    text = this.removeAccents(text)
    return text.replace(/[^a-zA-Z0-9-]/g, '')
  }

  private static setNy(text: string): string {
    return text.replace(/ñ/g, 'ny')
  }

  private static removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
}
