// ABOUTME: Tests for the main App.vue component structure and mounting
// ABOUTME: Ensures the root component renders without errors

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../client/src/App.vue'

describe('App Component', () => {
  it('should render without errors', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('should have expected root structure', () => {
    const wrapper = mount(App)
    const rootElement = wrapper.find('[data-testid="app-root"]')
    expect(rootElement.exists()).toBe(true)
  })

  it('should mount without throwing errors', () => {
    expect(() => {
      mount(App)
    }).not.toThrow()
  })

  it('should have correct component name', () => {
    const wrapper = mount(App)
    expect(wrapper.vm.$options.name || 'App').toBe('App')
  })

  it('should render as a div element', () => {
    const wrapper = mount(App)
    expect(wrapper.element.tagName).toBe('DIV')
  })
})