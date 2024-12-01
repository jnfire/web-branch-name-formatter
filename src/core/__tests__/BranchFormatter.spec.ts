import { describe, it, expect } from 'vitest';
import { BranchFormatter } from '@/core/BranchFormatter';
import type { BranchType } from '@/core/BranchTypes';

describe('BranchFormatter', () => {
  it('should format branch name correctly', () => {
    const branch: BranchType = {
      ticketId: 'TICKET-123',
      featureName: 'New Feature',
    };

    const formattedName = BranchFormatter.format(branch);

    expect(formattedName).toBe('TICKET-123--new-feature');
  });

  it('should handle special characters in featureName', () => {
    const branch: BranchType = {
      ticketId: 'TICKET-456',
      featureName: 'Feature with Special Characters!@#',
    };

    const formattedName = BranchFormatter.format(branch);

    expect(formattedName).toBe('TICKET-456--feature-with-special-characters');
  });

  it('should handle spaces in featureName', () => {
    const branch: BranchType = {
      ticketId: 'TICKET-789',
      featureName: 'Feature with spaces',
    };

    const formattedName = BranchFormatter.format(branch);

    expect(formattedName).toBe('TICKET-789--feature-with-spaces');
  });

  it('should handle multiple dashes in featureName', () => {
    const branch: BranchType = {
      ticketId: 'TICKET-101',
      featureName: 'Feature---with---multiple---dashes',
    };

    const formattedName = BranchFormatter.format(branch);

    expect(formattedName).toBe('TICKET-101--feature-with-multiple-dashes');
  });

  it('should convert ticketId to uppercase', () => {
    const branch: BranchType = {
      ticketId: 'ticket-202',
      featureName: 'Feature',
    };

    const formattedName = BranchFormatter.format(branch);

    expect(formattedName).toBe('TICKET-202--feature');
  });
});