import type { BranchType } from "./BranchTypes";


export class BranchFormatter {
  static format(branch: BranchType): string {
    const ticketId: string = this.cleanTicketId(branch.ticketId);
    const featureName: string = this.cleanFeatureName(branch.featureName);
    return `${ticketId}--${featureName}`;
  }

  private static cleanTicketId(ticketId: string): string {
    return this.replaceSpaces(
      this.toUpperCase(ticketId)
    );
  }

  private static toUpperCase(text: string): string {
    return text.toUpperCase();
  }

  private static cleanFeatureName(featureName: string): string {
    return this.basicClean(
      this.toLowerCase(featureName)
    );
  }

  private  static toLowerCase(text: string): string {
    return text.toLowerCase();
  }

  private static basicClean(text: string): string {
    return this.removeSpecialCharacters(
      this.removeMultipleDashes(
        this.replaceSpaces(text)
      )
    );
  }

  private static removeSpecialCharacters(text: string): string {
    return text.replace(/[^a-zA-Z0-9-]/g, '');
  }

  private static replaceSpaces(text: string): string {
    return text.replace(/\s/g, '-');
  }

  private static removeMultipleDashes(text: string): string {
    return text.replace(/-+/g, '-');
  }
}