// ABOUTME: Tests for MessageBubble component covering rendering, props, timestamps, and error states
// ABOUTME: Verifies the component displays messages correctly for different roles and states

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageBubble from '../../../client/src/components/MessageBubble.vue'

describe('MessageBubble', () => {
  it('should render with user role', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Hello, Claude!',
        timestamp: new Date('2024-01-15T10:30:00')
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello, Claude!')
    expect(wrapper.attributes('data-role')).toBe('user')
  })

  it('should render with assistant role', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: new Date('2024-01-15T10:31:00')
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello! How can I help you today?')
    expect(wrapper.attributes('data-role')).toBe('assistant')
  })

  it('should display content correctly', () => {
    const content = 'This is a test message with **markdown** support.'
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content,
        timestamp: new Date()
      }
    })

    const messageContent = wrapper.find('[data-testid="message-content"]')
    expect(messageContent.exists()).toBe(true)
    expect(messageContent.text()).toBe(content)
  })

  it('should format timestamp correctly', () => {
    const timestamp = new Date('2024-01-15T14:30:00')
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Test message',
        timestamp
      }
    })

    const timeElement = wrapper.find('time')
    expect(timeElement.exists()).toBe(true)
    expect(timeElement.text()).toBe('2:30 PM')
    expect(timeElement.attributes('datetime')).toBe(timestamp.toISOString())
  })

  it('should handle error state styling', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Error: Failed to process request',
        timestamp: new Date(),
        isError: true
      }
    })

    expect(wrapper.classes()).toContain('message-error')
    expect(wrapper.attributes('data-error')).toBe('true')
  })

  it('should handle missing timestamp gracefully', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Message without timestamp'
      }
    })

    const timeElement = wrapper.find('time')
    expect(timeElement.exists()).toBe(false)
  })

  it('should handle empty content', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: '',
        timestamp: new Date()
      }
    })

    const messageContent = wrapper.find('[data-testid="message-content"]')
    expect(messageContent.text()).toBe('')
  })

  it('should handle long content appropriately', () => {
    const longContent = 'Lorem ipsum '.repeat(100).trim()
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: longContent,
        timestamp: new Date()
      }
    })

    const messageContent = wrapper.find('[data-testid="message-content"]')
    expect(messageContent.text()).toBe(longContent)
    expect(wrapper.classes()).toContain('message-wrap')
  })
})

describe('MessageBubble Accessibility', () => {
  it('should have proper ARIA labels', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Test message',
        timestamp: new Date()
      }
    })

    expect(wrapper.attributes('role')).toBe('article')
    expect(wrapper.attributes('aria-label')).toContain('user message')
  })

  it('should use semantic HTML', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Test response',
        timestamp: new Date()
      }
    })

    const article = wrapper.find('article')
    expect(article.exists()).toBe(true)
    
    const time = wrapper.find('time')
    expect(time.exists()).toBe(true)
    expect(time.attributes('datetime')).toBeTruthy()
  })

  it('should be keyboard navigable', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Test message',
        timestamp: new Date()
      }
    })

    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should provide screen reader content', () => {
    const timestamp = new Date('2024-01-15T14:30:00')
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Hello there!',
        timestamp
      }
    })

    const srOnly = wrapper.find('.sr-only')
    expect(srOnly.exists()).toBe(true)
    expect(srOnly.text()).toContain('assistant')
  })

  it('should mark error messages for screen readers', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Error occurred',
        timestamp: new Date(),
        isError: true
      }
    })

    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('aria-label')).toContain('error')
  })
})

describe('MessageBubble Styles', () => {
  it('should apply user message styling', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'User message',
        timestamp: new Date()
      }
    })

    expect(wrapper.classes()).toContain('message-user')
    expect(wrapper.classes()).toContain('message-bubble')
  })

  it('should apply assistant message styling', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Assistant message',
        timestamp: new Date()
      }
    })

    expect(wrapper.classes()).toContain('message-assistant')
    expect(wrapper.classes()).toContain('message-bubble')
  })

  it('should have base bubble styling', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Test',
        timestamp: new Date()
      }
    })

    expect(wrapper.classes()).toContain('message-bubble')
    expect(wrapper.classes()).toContain('message-wrap')
  })

  it('should apply error styling when isError is true', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: 'Error message',
        timestamp: new Date(),
        isError: true
      }
    })

    expect(wrapper.classes()).toContain('message-error')
    expect(wrapper.classes()).toContain('message-assistant')
    expect(wrapper.classes()).toContain('message-bubble')
  })

  it('should not apply error styling when isError is false', () => {
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'user',
        content: 'Normal message',
        timestamp: new Date(),
        isError: false
      }
    })

    expect(wrapper.classes()).not.toContain('message-error')
  })

  it('should apply message wrap for long content', () => {
    const longContent = 'This is a very long message that should wrap properly'
    const wrapper = mount(MessageBubble, {
      props: {
        role: 'assistant',
        content: longContent,
        timestamp: new Date()
      }
    })

    expect(wrapper.classes()).toContain('message-wrap')
  })
})