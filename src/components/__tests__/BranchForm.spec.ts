import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BranchForm from '../BranchForm.vue'
import { FormatManager } from '@/core/FormatManager'

// Mocking FormatManager for the tests
FormatManager.getVisibleFormats = () => [
  {
    id: 'test',
    name: 'Test',
    templateString: '{testId}',
    isReadonly: false,
    isVisible: true,
    language: 'es',
    fields: [
      { id: 'testId', label: 'Test ID', capitalization: 'AS_IS' }
    ]
  }
]

describe('BranchForm', () => {
  it('renders the dynamic form correctly', () => {
    const wrapper = mount(BranchForm, {
      global: {
        mocks: {
          $t: (msg: string) => msg
        }
      }
    })
    // Expect input with name testId to exist
    expect(wrapper.find('input[name="testId"]').exists()).toBe(true)
  })

  it('emits submitForm event with correct payload', async () => {
    const wrapper = mount(BranchForm, {
      global: {
        mocks: {
          $t: (msg: string) => msg
        }
      }
    })

    const input = wrapper.find('input[name="testId"]')
    await input.setValue('my-test-value')
    await wrapper.find('form').trigger('submit')

    const emitted = wrapper.emitted('submitForm')
    expect(emitted).toBeTruthy()
    expect(emitted![0][1]).toEqual({ testId: 'my-test-value' })
  })
})
