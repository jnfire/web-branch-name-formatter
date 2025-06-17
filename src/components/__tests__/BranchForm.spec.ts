import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BranchForm from '../BranchForm.vue'
import type { BranchFormType } from '@/core/BranchTypes'

describe('BranchForm', () => {
  it('renders the form correctly', () => {
    const wrapper = mount(BranchForm)
    expect(wrapper.find('form[aria-label="Create branch name form"]').exists()).toBe(true)
    expect(wrapper.find('input[name="ticket-id"]').exists()).toBe(true)
    expect(wrapper.find('input[name="develop-name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="project-id"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('emits submitForm event with correct payload when form is submitted', async () => {
    const wrapper = mount(BranchForm)
    const ticketIdInput = wrapper.find('input[name="ticket-id"]')
    const featureNameInput = wrapper.find('input[name="develop-name"]')
    const projectIdInput = wrapper.find('input[name="project-id"]')

    await projectIdInput.setValue('PROJ')

    await ticketIdInput.setValue('12345')
    await featureNameInput.setValue('feature-branch')

    await wrapper.find('form').trigger('submit.prevent')

    const emittedEvents = wrapper.emitted()
    console.log('Emitted Events:', emittedEvents)
    const submitFormEvent = emittedEvents.submitForm as Array<Array<BranchFormType>>
    expect(submitFormEvent).toBeTruthy()
    const emittedPayload = submitFormEvent![0][0] as BranchFormType
    expect(emittedPayload).toMatchObject({
      projectId: 'PROJ',
      ticketId: '12345',
      featureName: 'feature-branch'
    })
  })
})
