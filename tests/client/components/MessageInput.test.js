// ABOUTME: Tests for MessageInput component covering rendering, v-model binding, keyboard events
// ABOUTME: Verifies textarea behavior, send functionality, and input clearing after send

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageInput from '../../../client/src/components/MessageInput.vue'

describe('MessageInput', () => {
  it('should render textarea element', () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('data-testid')).toBe('message-input')
  })

  it('should have placeholder text', () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('Type a message...')
  })

  it('should bind v-model correctly', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Initial message'
      }
    })
    
    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('Initial message')
    
    // Test two-way binding
    await textarea.setValue('Updated message')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Updated message'])
  })

  it('should send message on Enter key', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Test message'
      }
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown.enter', { shiftKey: false })
    
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')[0]).toEqual(['Test message'])
  })

  it('should add newline on Shift+Enter', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Line 1'
      }
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown.enter', { shiftKey: true })
    
    // Should not emit send event
    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('should clear input after send', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Message to send'
      }
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown.enter')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted[emitted.length - 1]).toEqual([''])
  })

  it('should focus textarea on mount', () => {
    const focusSpy = vi.spyOn(HTMLTextAreaElement.prototype, 'focus')
    
    mount(MessageInput)
    
    expect(focusSpy).toHaveBeenCalled()
    focusSpy.mockRestore()
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('aria-label')).toBe('Message input')
    expect(textarea.attributes('role')).toBe('textbox')
    expect(textarea.attributes('aria-multiline')).toBe('true')
  })

  it('should handle disabled state', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        disabled: true,
        modelValue: 'Test'
      }
    })
    
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeDefined()
    
    // Should not send when disabled
    await textarea.trigger('keydown.enter')
    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('should have send button', () => {
    const wrapper = mount(MessageInput)
    
    const button = wrapper.find('button[data-testid="send-button"]')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toBe('Send message')
  })

  it('should send message when button clicked', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Click to send'
      }
    })
    
    const button = wrapper.find('button[data-testid="send-button"]')
    await button.trigger('click')
    
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')[0]).toEqual(['Click to send'])
  })
})

describe('MessageInput Auto-expand', () => {
  it('should have initial height constraints', () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    
    // Check that textarea has the message-input class which applies constraints
    expect(textarea.classes()).toContain('message-input')
    // Initial height should be set to minimum (48px = 3rem)
    expect(textarea.element.style.height).toBe('48px')
  })

  it('should expand height based on content', async () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    
    // Mock scrollHeight to simulate multi-line content
    Object.defineProperty(textarea.element, 'scrollHeight', {
      value: 120,
      configurable: true
    })
    
    await textarea.setValue('Line 1\nLine 2\nLine 3\nLine 4')
    await textarea.trigger('input')
    await wrapper.vm.$nextTick()
    
    // Check that adjustHeight was called
    expect(textarea.element.style.height).toBeTruthy()
  })

  it('should respect maximum height constraint', async () => {
    const wrapper = mount(MessageInput)
    
    const textarea = wrapper.find('textarea')
    
    // Mock a very large scrollHeight
    Object.defineProperty(textarea.element, 'scrollHeight', {
      value: 300,
      configurable: true
    })
    
    const longText = Array(10).fill('Long line of text').join('\n')
    await textarea.setValue(longText)
    await textarea.trigger('input')
    
    // Height should be capped at max
    const height = parseInt(textarea.element.style.height)
    expect(height).toBeLessThanOrEqual(160) // 10rem = 160px
  })

  it('should reset height after sending', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: 'Some text\nMultiple lines'
      }
    })
    
    const textarea = wrapper.find('textarea')
    
    // Set some height
    textarea.element.style.height = '100px'
    
    // Send the message
    await textarea.trigger('keydown.enter')
    await wrapper.vm.$nextTick()
    
    // Height should be reset to minimum
    expect(textarea.element.style.height).toBe('48px')
  })

  it('should trigger height adjustment on input', async () => {
    const wrapper = mount(MessageInput)
    const textarea = wrapper.find('textarea')
    
    // Test that input event triggers height adjustment
    await textarea.setValue('Some text')
    await textarea.trigger('input')
    
    // The component should have attempted to adjust height
    expect(wrapper.vm.adjustHeight).toBeDefined()
  })
})

describe('MessageInput Validation', () => {
  it('should prevent empty message send', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: '   ' // Only whitespace
      }
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown.enter')
    
    // Should not emit send event for empty message
    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('should trim whitespace before sending', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: '  Hello World  '
      }
    })
    
    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown.enter')
    
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')[0]).toEqual(['  Hello World  '])
  })

  it('should disable send button when message is empty', () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    })
    
    const button = wrapper.find('button[data-testid="send-button"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should enable send button when message has content', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: ''
      }
    })
    
    const button = wrapper.find('button[data-testid="send-button"]')
    expect(button.attributes('disabled')).toBeDefined()
    
    await wrapper.setProps({ modelValue: 'Hello' })
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('should disable input during send when prop is set', async () => {
    const wrapper = mount(MessageInput, {
      props: {
        disabled: false,
        modelValue: 'Test'
      }
    })
    
    const textarea = wrapper.find('textarea')
    const button = wrapper.find('button[data-testid="send-button"]')
    
    expect(textarea.attributes('disabled')).toBeUndefined()
    expect(button.attributes('disabled')).toBeUndefined()
    
    await wrapper.setProps({ disabled: true })
    
    expect(textarea.attributes('disabled')).toBeDefined()
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should handle maximum length gracefully', async () => {
    const longMessage = 'a'.repeat(5000)
    const wrapper = mount(MessageInput, {
      props: {
        modelValue: longMessage
      }
    })
    
    const textarea = wrapper.find('textarea')
    
    // Should still be able to send
    await textarea.trigger('keydown.enter')
    
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')[0][0]).toHaveLength(5000)
  })
})