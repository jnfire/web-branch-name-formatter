import { describe, it, expect } from 'vitest';
import { BranchManager } from '@/core/BranchManager';
import { Branch } from '@/core/Branch';
import type { BranchFormType } from '@/core/BranchTypes';

describe('BranchManager', () => {
  it('should initialize with an empty list of branches', () => {
    const manager = new BranchManager();
    expect(manager.getBranches()).toEqual([]);
  });

  it('should add a new branch', () => {
    const manager = new BranchManager();
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' };

    manager.createBranch(formData);

    const branches = manager.getBranches();
    expect(branches).toHaveLength(1);
    expect(branches[0].ticketId).toBe('TICKET-123');
    expect(branches[0].featureName).toBe('New Feature');
    expect(branches[0].branchName).toBe('TICKET-123--new-feature');
  });

  it('should remove a branch', () => {
    const manager = new BranchManager();
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' };

    manager.createBranch(formData);
    const branchToDelete = manager.getBranches()[0];

    manager.deleteBranch(branchToDelete.id);

    expect(manager.getBranches()).toHaveLength(0);
  });

  it('should not remove a branch if it does not exist', () => {
    const manager = new BranchManager();
    const formData: BranchFormType = { ticketId: 'TICKET-123', featureName: 'New Feature' };

    manager.createBranch(formData);
    const nonExistentBranch = new Branch({ id: 999, ticketId: 'TICKET-999', featureName: 'Non-existent' });

    manager.deleteBranch(nonExistentBranch.id);

    expect(manager.getBranches()).toHaveLength(1);
  });
});