import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import CreatedBranchList from '@/components/CreatedBranchList.vue';
import CreatedBranchItem from '@/components/CreatedBranchItem.vue';

describe('CreatedBranchList.vue', () => {
  it('renders a list of branch items', () => {
    const branches = {
      'branch1': 'Feature 1',
      'branch2': 'Feature 2',
      'branch3': 'Feature 3'
    };

    const wrapper = mount(CreatedBranchList, {
      props: { branches }
    });

    const items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(Object.keys(branches).length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(Object.values(branches)[index]);
    });
  });

  it('updates the list when branches prop changes', async () => {
    const branches = {
      'branch1': 'Feature 1',
      'branch2': 'Feature 2'
    };

    const wrapper = mount(CreatedBranchList, {
      props: { branches }
    });

    let items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(Object.keys(branches).length);

    const newBranches = {
      'branch1': 'Feature 1',
      'branch2': 'Feature 2',
      'branch3': 'Feature 3'
    };

    await wrapper.setProps({ branches: newBranches });

    items = wrapper.findAllComponents(CreatedBranchItem);
    expect(items).toHaveLength(Object.keys(newBranches).length);

    items.forEach((item, index) => {
      expect(item.props('branchName')).toBe(Object.values(newBranches)[index]);
    });
  });
});