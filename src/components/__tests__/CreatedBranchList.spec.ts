import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CreatedBranchList from '@/components/CreatedBranchList.vue';
import CreatedBranchItem from '@/components/CreatedBranchItem.vue';
import { Branch } from '@/core/Branch';

describe('CreatedBranchList.vue', () => {
  it('renders a list of branch items', () => {
    const branches: Branch[] = [
      new Branch({ id: 1, ticketId: 'T1', developName: 'Feature1', branchName: 'T1-Feature1' }),
      new Branch({ id: 2, ticketId: 'T2', developName: 'Feature2', branchName: 'T2-Feature2' }),
      new Branch({ id: 3, ticketId: 'T3', developName: 'Feature3', branchName: 'T3-Feature3' })
    ];

    const wrapper = mount(CreatedBranchList, {
      props: { branches }
    });

    const items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(branches.length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(branches[index].branchName);
    });
  });

  it('updates the list when branches prop changes', async () => {
    const branches: Branch[] = [
      new Branch({ id: 1, ticketId: 'T1', developName: 'Feature1', branchName: 'T1-Feature1' }),
      new Branch({ id: 2, ticketId: 'T2', developName: 'Feature2', branchName: 'T2-Feature2' })
    ];

    const wrapper = mount(CreatedBranchList, {
      props: { branches }
    });

    let items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(branches.length);

    const newBranches: Branch[] = [
      new Branch({ id: 1, ticketId: 'T1', developName: 'Feature1', branchName: 'T1-Feature1' }),
      new Branch({ id: 2, ticketId: 'T2', developName: 'Feature2', branchName: 'T2-Feature2' }),
      new Branch({ id: 3, ticketId: 'T3', developName: 'Feature3', branchName: 'T3-Feature3' })
    ];

    await wrapper.setProps({ branches: newBranches });

    items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(newBranches.length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(newBranches[index].branchName);
    });
  });
});